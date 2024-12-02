import Graph from '../models/Graph';
import AlgorithmState, { Step } from '../models/AlgorithmState';

class Dijkstra {
    static findShortestPath(graph: Graph, startNode: number): AlgorithmState {
        const state = new AlgorithmState();
        const nodes = graph.getNodes();
        
        const distances = new Map<number, number>();
        const previousNodes = new Map<number, number>();
        const visitedNodes = new Set<number>();
        const queue: number[] = [];  // 用于存储待处理的节点

        // 初始化距离
        for (let i = 1; i <= nodes; i++) {
            distances.set(i, i === startNode ? 0 : Infinity);
            if (i === startNode) {
                queue.push(i);  // 将起始节点加入队列
            }
        }

        // 记录初始状态
        state.addStep({
            currentNode: startNode,
            visitedNodes: new Set(visitedNodes),
            distances: new Map(distances),
            previousNodes: new Map(previousNodes),
            description: `初始化：将起始节点 ${startNode} 的距离设为 0，其他节点设为 ∞`
        });

        // 当队列不为空时继续处理
        while (queue.length > 0) {
            // 从队列中找到距离最小的节点
            let minDistance = Infinity;
            let minIndex = 0;
            queue.forEach((node, index) => {
                const distance = distances.get(node) || Infinity;
                if (distance < minDistance) {
                    minDistance = distance;
                    minIndex = index;
                }
            });

            // 取出当前要处理的节点
            const currentNode = queue.splice(minIndex, 1)[0];
            visitedNodes.add(currentNode);

            state.addStep({
                currentNode,
                visitedNodes: new Set(visitedNodes),
                distances: new Map(distances),
                previousNodes: new Map(previousNodes),
                description: `从队列中选择距离最小的节点 ${currentNode} 进行处理`
            });

            // 获取当前节点的所有邻居
            const neighbors = graph.getNeighbors(currentNode);
            if (neighbors) {
                neighbors.forEach((weight, neighbor) => {
                    if (!visitedNodes.has(neighbor)) {
                        const currentDistance = distances.get(neighbor) || Infinity;
                        const newDistance = (distances.get(currentNode) || 0) + weight;
                        
                        // 如果找到更短的路径
                        if (newDistance < currentDistance) {
                            distances.set(neighbor, newDistance);
                            previousNodes.set(neighbor, currentNode);
                            
                            // 如果该节点还不在队列中，将其加入队列
                            if (!queue.includes(neighbor)) {
                                queue.push(neighbor);
                            }

                            state.addStep({
                                currentNode,
                                visitedNodes: new Set(visitedNodes),
                                distances: new Map(distances),
                                previousNodes: new Map(previousNodes),
                                description: `通过节点 ${currentNode} 更新节点 ${neighbor} 的距离：${currentDistance === Infinity ? '∞' : currentDistance} → ${newDistance}`
                            });
                        } else {
                            state.addStep({
                                currentNode,
                                visitedNodes: new Set(visitedNodes),
                                distances: new Map(distances),
                                previousNodes: new Map(previousNodes),
                                description: `检查节点 ${neighbor}：当前距离 ${currentDistance} 已经是最优的`
                            });
                        }
                    }
                });
            }
        }

        // 记录最终状态
        let finalDescription = '算法执行完成。\n最终结果：\n';
        distances.forEach((distance, node) => {
            finalDescription += `节点 ${node} 到起点的最短距离: ${distance === Infinity ? '不可达' : distance}\n`;
        });

        state.addStep({
            visitedNodes: new Set(visitedNodes),
            distances: new Map(distances),
            previousNodes: new Map(previousNodes),
            description: finalDescription
        });

        return state;
    }
}

export default Dijkstra; 