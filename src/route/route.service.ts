import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DijkstraService } from '../dijkstra/dijkstra.service';
import { AdjacencyMap } from '../dijkstra/dijkstra.interfaces';
import { NetworkService } from '../network/network.service';
import { EdgeSubDocument } from '../network/schemas/network.schema';
import { OptimizeRouteDto } from './dtos/optimize-route.dto';

export interface OptimizeRouteResponse {
  graphId: string;
  totalCost: number;
  path: string[];
  durationMs: number;
}

@Injectable()
export class RouteService {
  private readonly logger = new Logger(RouteService.name);

  constructor(
    private readonly networkService: NetworkService,
    private readonly dijkstraService: DijkstraService,
  ) {}

  /**
   * Finds the optimal route between two nodes in the specified network.
   */
  async optimize(
    networkId: string,
    dto: OptimizeRouteDto,
  ): Promise<OptimizeRouteResponse> {
    const startTime = Date.now();

    // 1. Fetch network
    const network = await this.networkService.findById(networkId);

    // 2. Validate nodes exist
    const nodeSet = new Set<string>(network.nodes);

    if (!nodeSet.has(dto.originNodeId)) {
      throw new BadRequestException(
        `Origin node "${dto.originNodeId}" does not exist in network "${networkId}"`,
      );
    }

    if (!nodeSet.has(dto.destinationNodeId)) {
      throw new BadRequestException(
        `Destination node "${dto.destinationNodeId}" does not exist in network "${networkId}"`,
      );
    }

    // 3. Filter edges based on constraints
    let edges: EdgeSubDocument[] = network.edges as EdgeSubDocument[];

    if (dto.constraints?.avoidHighways) {
      edges = edges.filter((edge) => !edge.isHighway);
      this.logger.log('Constraint applied: avoidHighways=true');
    }

    // 4. Build adjacency map with the correct weight based on preference
    const preference = dto.preference ?? 'shortest';
    const adjacencyMap = this.buildAdjacencyMap(edges, preference, nodeSet);

    // 5. Run Dijkstra
    const result = this.dijkstraService.compute(
      adjacencyMap,
      dto.originNodeId,
      dto.destinationNodeId,
    );

    if (!result.found) {
      throw new NotFoundException(
        `No path found from "${dto.originNodeId}" to "${dto.destinationNodeId}" in network "${networkId}". ` +
          'The destination may be unreachable with the current constraints.',
      );
    }

    const durationMs = Date.now() - startTime;

    this.logger.log(
      `Route optimized: ${result.path.join(' → ')} | cost=${result.totalCost} | ${durationMs}ms`,
    );

    return {
      graphId: networkId,
      totalCost: result.totalCost,
      path: result.path,
      durationMs,
    };
  }

  /**
   * Converts a flat list of edges into an adjacency map.
   * Weight selection:
   *   - 'fastest' → uses timeCost if available, otherwise falls back to cost
   *   - 'shortest' (default) → uses cost
   */
  private buildAdjacencyMap(
    edges: EdgeSubDocument[],
    preference: 'shortest' | 'fastest',
    nodeSet: Set<string>,
  ): AdjacencyMap {
    const map: AdjacencyMap = new Map();

    // Initialise every node with an empty neighbour list
    for (const node of nodeSet) {
      map.set(node, []);
    }

    for (const edge of edges) {
      const weight =
        preference === 'fastest' && edge.timeCost != null
          ? edge.timeCost
          : edge.cost;

      const neighbours = map.get(edge.from) ?? [];
      neighbours.push({ to: edge.to, weight });
      map.set(edge.from, neighbours);
    }

    return map;
  }
}
