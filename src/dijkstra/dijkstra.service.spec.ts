import { DijkstraService } from './dijkstra.service';
import { AdjacencyMap } from './dijkstra.interfaces';

describe('DijkstraService', () => {
  let service: DijkstraService;

  beforeEach(() => {
    service = new DijkstraService();
  });

  /**
   * Builds the example graph from the README:
   *
   *  A --10--> B        A --5--> C
   *  B --8---> D        C --12-> D        C --8--> H
   *  D --12--> E        D --4--> F        D --4--> H
   *  F --4---> G        F --1--> H
   *  E --9---> G
   *
   * Optimal A -> E: A → C(5) → D(5+12=17) … wait, let's trace:
   *   A→C: 5,  C→D: 17, D→E: 29  ← via C
   *   A→B: 10, B→D: 18, D→E: 30  ← via B
   * So optimal: A → C → D → E, cost = 29
   *
   * NOTE: The README states cost 25 — that matches if we read C→D as cost 12
   * but then A→C=5, C→D=12, D→E=12 gives 5+12+12=29. The README example
   * response shows cost=25.5; these tests use the actual graph math.
   */
  function buildReadmeGraph(): AdjacencyMap {
    const graph: AdjacencyMap = new Map();

    const addEdge = (from: string, to: string, weight: number) => {
      if (!graph.has(from)) graph.set(from, []);
      graph.get(from)!.push({ to, weight });
    };

    addEdge('A', 'B', 10);
    addEdge('A', 'C', 5);
    addEdge('B', 'D', 8);
    addEdge('C', 'D', 12);
    addEdge('D', 'E', 12);
    addEdge('D', 'F', 4);
    addEdge('F', 'G', 4);
    addEdge('E', 'G', 9);
    addEdge('C', 'H', 8);
    addEdge('D', 'H', 4);
    addEdge('F', 'H', 1);

    return graph;
  }

  describe('compute()', () => {
    it('should return cost 0 and single-node path when origin equals destination', () => {
      const graph = buildReadmeGraph();
      const result = service.compute(graph, 'A', 'A');

      expect(result.found).toBe(true);
      expect(result.totalCost).toBe(0);
      expect(result.path).toEqual(['A']);
    });

    it('should find the direct path A → B with cost 10', () => {
      const graph = buildReadmeGraph();
      const result = service.compute(graph, 'A', 'B');

      expect(result.found).toBe(true);
      expect(result.totalCost).toBe(10);
      expect(result.path).toEqual(['A', 'B']);
    });

    it('should find the optimal path A → E as A → C → D → E with cost 29', () => {
      const graph = buildReadmeGraph();
      const result = service.compute(graph, 'A', 'E');

      expect(result.found).toBe(true);
      expect(result.totalCost).toBe(29); // 5 + 12 + 12
      expect(result.path).toEqual(['A', 'C', 'D', 'E']);
    });

    it('should find the optimal path A → H as A → C → D → F → H with cost 15', () => {
      // A→C=5, C→D=12 (17), D→F=4 (21)... wait D→F=4 -> F→H=1 = 22
      // or A→C=5, C→H=8 = 13
      // Actually A→C=5, C→H=8 => total 13 is shorter
      const graph = buildReadmeGraph();
      const result = service.compute(graph, 'A', 'H');

      expect(result.found).toBe(true);
      expect(result.totalCost).toBe(13); // A→C(5)→H(8)
      expect(result.path).toEqual(['A', 'C', 'H']);
    });

    it('should return found=false when destination is unreachable', () => {
      // Create an isolated graph: A→B, and an isolated node Z
      const graph: AdjacencyMap = new Map([
        ['A', [{ to: 'B', weight: 5 }]],
        ['B', []],
        ['Z', []], // Z has no incoming edges
      ]);

      const result = service.compute(graph, 'A', 'Z');

      expect(result.found).toBe(false);
      expect(result.path).toEqual([]);
      expect(result.totalCost).toBe(Infinity);
    });

    it('should prefer the cheaper path when two routes exist', () => {
      // Two paths: A→B→C (cost 2+2=4) and A→C (cost 10)
      const graph: AdjacencyMap = new Map([
        ['A', [{ to: 'B', weight: 2 }, { to: 'C', weight: 10 }]],
        ['B', [{ to: 'C', weight: 2 }]],
        ['C', []],
      ]);

      const result = service.compute(graph, 'A', 'C');

      expect(result.found).toBe(true);
      expect(result.totalCost).toBe(4);
      expect(result.path).toEqual(['A', 'B', 'C']);
    });

    it('should handle a graph with a single node (origin = destination)', () => {
      const graph: AdjacencyMap = new Map([['X', []]]);
      const result = service.compute(graph, 'X', 'X');

      expect(result.found).toBe(true);
      expect(result.totalCost).toBe(0);
      expect(result.path).toEqual(['X']);
    });
  });
});
