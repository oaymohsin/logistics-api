export interface DijkstraEdge {
  to: string;
  weight: number;
}

export type AdjacencyMap = Map<string, DijkstraEdge[]>;

export interface DijkstraResult {
  found: boolean;
  path: string[];
  totalCost: number;
}
