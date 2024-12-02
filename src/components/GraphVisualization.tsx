import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Step } from '../models/AlgorithmState';
import { GraphNode, GraphEdge, D3Edge, D3Node } from '../types/graph';

interface GraphVisualizationProps {
    nodes: number;
    edges: GraphEdge[];
    currentStep: Step | null;
    isRunning: boolean;
    isAnalyzing: boolean;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ nodes, edges, currentStep, isRunning, isAnalyzing }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // 调整画布尺寸
        const width = 800;  // 减小宽度
        const height = 500;  // 减小高度
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // 清除之前的内容
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width/2},${height/2})`); // 将原点移到中心

        if (nodes === 0) return;

        // 创建节点数据 - 使用固定的圆形布局
        const radius = Math.min(innerWidth, innerHeight) * 0.35; // 根据画布大小调整半径
        const nodeData: GraphNode[] = Array.from({ length: nodes }, (_, i) => {
            const angle = (2 * Math.PI * i) / nodes - Math.PI / 2; // 从顶部开始布局
            return {
                id: i + 1,
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            };
        });

        // 转换边数据为D3可用的格式
        const d3Edges: D3Edge[] = edges.map(edge => ({
            source: nodeData[edge.source - 1],
            target: nodeData[edge.target - 1],
            weight: edge.weight
        }));

        // 创建箭头标记
        svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 30)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#999");

        // 绘制边
        const link = svg.append("g")
            .selectAll<SVGGElement, D3Edge>("g")
            .data(d3Edges)
            .enter()
            .append("g");

        // 边的线条
        link.append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrowhead)")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // 边的权重标签
        link.append("text")
            .text(d => d.weight)
            .attr("font-size", "14px")
            .attr("fill", "#666")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2);

        // 创建节点组
        const node = svg.append("g")
            .selectAll<SVGGElement, GraphNode>("g")
            .data(nodeData)
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .call(d3.drag<SVGGElement, GraphNode>()
                .on("drag", (event, d) => {
                    const newX = event.x;
                    const newY = event.y;
                    d.x = newX;
                    d.y = newY;
                    d3.select(event.sourceEvent.target.parentNode)
                        .attr("transform", `translate(${newX},${newY})`);
                    
                    // 更新相关的边
                    link.selectAll<SVGLineElement, D3Edge>("line")
                        .attr("x1", d => d.source.x)
                        .attr("y1", d => d.source.y)
                        .attr("x2", d => d.target.x)
                        .attr("y2", d => d.target.y);
                    
                    // 更新边的权重标签位置
                    link.selectAll<SVGTextElement, D3Edge>("text")
                        .attr("x", d => (d.source.x + d.target.x) / 2)
                        .attr("y", d => (d.source.y + d.target.y) / 2);
                }));

        // 绘制节点圆形
        node.append("circle")
            .attr("r", 25)
            .attr("fill", d => {
                if (!currentStep) return "#3498db"; // 默认蓝色
                if (isAnalyzing) {
                    // 分析模式下的颜色逻辑
                    if (currentStep.visitedNodes.has(d.id)) {
                        return "#2ecc71"; // 已找到最短路的节点为绿色
                    } else if (currentStep.distances.get(d.id) !== Infinity) {
                        return "#3498db"; // 已更新但未确定最短路的节点为蓝色
                    }
                    return "#e74c3c"; // 未访问的节点为红色
                } else {
                    // 非分析模式下的颜色逻辑
                    if (currentStep.visitedNodes.has(d.id)) {
                        return "#2ecc71"; // 已访问的节点为绿色
                    }
                    return "#3498db"; // 未访问的节点保持蓝色
                }
            })
            .attr("stroke", d => {
                if (currentStep?.currentNode === d.id) return "#e74c3c";
                return "#fff";
            })
            .attr("stroke-width", d => currentStep?.currentNode === d.id ? 3 : 2);

        // 绘制节点标签
        node.append("text")
            .text(d => d.id)
            .attr("font-size", "16px")
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle");

        // 添加当前距离标签
        node.append("text")
            .attr("dy", 40)
            .attr("text-anchor", "middle")
            .attr("fill", "#333")
            .attr("font-weight", "bold")
            .text(d => {
                if (!currentStep) return "";
                const distance = currentStep.distances.get(d.id);
                return distance === Infinity ? "∞" : distance?.toString() || "";
            });

    }, [nodes, edges, currentStep, isRunning, isAnalyzing]);

    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <svg 
                ref={svgRef} 
                style={{ 
                    background: '#f8f9fa',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                }} 
            />
        </div>
    );
};

export default GraphVisualization; 