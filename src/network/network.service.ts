import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UploadNetworkDto } from './dtos/upload-network.dto';
import { Network, NetworkDocument } from './schemas/network.schema';

@Injectable()
export class NetworkService {
  private readonly logger = new Logger(NetworkService.name);

  constructor(
    @InjectModel(Network.name) private readonly networkModel: Model<NetworkDocument>,
  ) {}

  /**
   * Saves a new network graph to MongoDB.
   * Derives the unique node list from the provided edges.
   */
  async upload(dto: UploadNetworkDto): Promise<{ id: string }> {
    const nodeSet = new Set<string>();
    for (const edge of dto.edges) {
      nodeSet.add(edge.from);
      nodeSet.add(edge.to);
    }

    const network = await this.networkModel.create({
      edges: dto.edges,
      nodes: Array.from(nodeSet),
    });

    this.logger.log(`Network created with ID: ${network._id.toString()}`);
    return { id: network._id.toString() };
  }

  /**
   * Returns all node names for a given network ID.
   */
  async getNodes(id: string): Promise<{ nodes: string[] }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid network ID format: "${id}"`);
    }

    const network = await this.networkModel.findById(id).select('nodes').lean().exec();

    if (!network) {
      throw new NotFoundException(`Network with ID "${id}" not found`);
    }

    return { nodes: network.nodes };
  }

  /**
   * Returns the full network document (used internally by RouteService).
   */
  async findById(id: string): Promise<NetworkDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid network ID format: "${id}"`);
    }

    const network = await this.networkModel.findById(id).lean().exec();

    if (!network) {
      throw new NotFoundException(`Network with ID "${id}" not found`);
    }

    return network as NetworkDocument;
  }
}
