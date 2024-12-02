class Graph {
    private nodes: number;
    private adjacencyList: Map<number, Map<number, number>>;
    private isDirected: boolean;

    constructor(nodes: number, isDirected: boolean = false) {
        this.nodes = nodes;
        this.adjacencyList = new Map();
        this.isDirected = isDirected;
        
        // 初始化邻接表
        for (let i = 1; i <= nodes; i++) {
            this.adjacencyList.set(i, new Map());
        }
    }

    addEdge(from: number, to: number, weight: number): void {
        this.adjacencyList.get(from)?.set(to, weight);
        if (!this.isDirected) {
            this.adjacencyList.get(to)?.set(from, weight);
        }
    }

    getNeighbors(node: number): Map<number, number> | undefined {
        return this.adjacencyList.get(node);
    }

    getNodes(): number {
        return this.nodes;
    }
}

export default Graph; 