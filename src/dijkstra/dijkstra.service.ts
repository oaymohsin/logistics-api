import { Injectable } from '@nestjs/common';
import { AdjacencyMap, DijkstraResult } from './dijkstra.interfaces';

/**
 * DijkstraService
 *
 * A standalone, framework-agnostic service that implements Dijkstra's
 * shortest-path algorithm using a simple min-priority queue (binary heap
 * emulated via a sorted array for clarity and testability).
 *
 * No business logic from other modules lives here — pure algorithm only.
 */
@Injectable()
export class DijkstraService {
  /**
   * Computes the shortest path between `origin` and `destination` on the
   * provided adjacency map.
   *
   * @param graph     - Adjacency map: node → list of { to, weight } edges
   * @param origin    - Starting node ID
   * @param destination - Target node ID
   * @returns DijkstraResult with path, totalCost, and found flag
   */
  compute(
    graph: AdjacencyMap,
    origin: string,
    destination: string,
  ): DijkstraResult {
    // Handle trivial case: same origin and destination
    if (origin === destination) {
      return { found: true, path: [origin], totalCost: 0 };
    }

    // dist map: shortest known cost to each node
    const dist = new Map<string, number>();
    // prev map: previous node in optimal path
    const prev = new Map<string, string | null>();
    // visited set
    const visited = new Set<string>();

    // Min-priority queue: [cost, nodeId]
    const queue: Array<[number, string]> = [];

    // Initialise all known nodes with Infinity
    for (const node of graph.keys()) {
      dist.set(node, Infinity);
      prev.set(node, null);
    }

    // Seed the origin
    dist.set(origin, 0);
    queue.push([0, origin]);

    while (queue.length > 0) {
      // Sort ascending by cost and pop smallest (simulates min-heap)
      queue.sort((a, b) => a[0] - b[0]);
      const [currentCost, currentNode] = queue.shift()!;

      // Skip stale entries
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);

      // Early exit: destination reached
      if (currentNode === destination) break;

      // Relax neighbours
      const neighbours = graph.get(currentNode) ?? [];
      for (const { to, weight } of neighbours) {
        if (visited.has(to)) continue;

        const newCost = currentCost + weight;
        if (newCost < (dist.get(to) ?? Infinity)) {
          dist.set(to, newCost);
          prev.set(to, currentNode);
          queue.push([newCost, to]);
        }
      }
    }

    // Check if destination is reachable
    const totalCost = dist.get(destination) ?? Infinity;
    if (totalCost === Infinity) {
      return { found: false, path: [], totalCost: Infinity };
    }

    // Reconstruct path by backtracking through prev map
    const path: string[] = [];
    let current: string | null | undefined = destination;
    while (current != null) {
      path.unshift(current);
      current = prev.get(current);
    }

    return { found: true, path, totalCost };
  }
}
