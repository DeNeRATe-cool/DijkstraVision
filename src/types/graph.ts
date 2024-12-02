import * as d3 from 'd3';

export interface GraphNode extends d3.SimulationNodeDatum {
    id: number;
    x: number;
    y: number;
    fx?: number | null;
    fy?: number | null;
}

export interface GraphEdge {
    source: number;
    target: number;
    weight: number;
}

export interface D3Edge extends d3.SimulationLinkDatum<GraphNode> {
    source: GraphNode;
    target: GraphNode;
    weight: number;
    index?: number;
}

export interface D3Node extends GraphNode {
    index?: number;
    x: number;
    y: number;
    vx?: number;
    vy?: number;
} 