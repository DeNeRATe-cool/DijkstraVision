import React, { useState, useEffect } from 'react';
import GraphVisualization from './components/GraphVisualization';
import ControlPanel from './components/ControlPanel';
import Graph from './models/Graph';
import Dijkstra from './algorithms/Dijkstra';
import AlgorithmState, { Step } from './models/AlgorithmState';
import { GraphEdge } from './types/graph';

const App: React.FC = () => {
    const [nodeCount, setNodeCount] = useState<number>(0);
    const [graph, setGraph] = useState<Graph>(new Graph(0));
    const [edges, setEdges] = useState<GraphEdge[]>([]);
    const [algorithmState, setAlgorithmState] = useState<AlgorithmState | null>(null);
    const [currentStep, setCurrentStep] = useState<Step | null>(null);
    const [startNode, setStartNode] = useState<number>(1);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [autoPlaySpeed, setAutoPlaySpeed] = useState<number>(1000); // 毫秒
    const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [finalState, setFinalState] = useState<AlgorithmState | null>(null);

    const handleAddNode = () => {
        const newCount = nodeCount + 1;
        const newGraph = new Graph(newCount);
        edges.forEach(edge => {
            newGraph.addEdge(edge.source, edge.target, edge.weight);
        });
        
        setNodeCount(newCount);
        setGraph(newGraph);
    };

    const handleAddEdge = (from: number, to: number, weight: number) => {
        if (from > nodeCount || to > nodeCount) {
            alert('节点不存在！请先添加足够的节点。');
            return;
        }
        if (from === to) {
            alert('不能添加自环！');
            return;
        }
        if (edges.some(edge => edge.source === from && edge.target === to)) {
            alert('该边已存在！');
            return;
        }
        
        graph.addEdge(from, to, weight);
        setEdges(prevEdges => [...prevEdges, { source: from, target: to, weight }]);
    };

    const handleRunAlgorithm = () => {
        if (nodeCount === 0) {
            alert('请先添加节点！');
            return;
        }
        if (edges.length === 0) {
            alert('请先添加边！');
            return;
        }
        if (startNode > nodeCount) {
            alert('起始节点不存在！');
            return;
        }

        // 运行算法到最终状态
        const state = Dijkstra.findShortestPath(graph, startNode);
        setFinalState(state);
        while (true) {
            const step = state.nextStep();
            if (!step) break;
        }
        setCurrentStep(state.getCurrentStep());
        setAlgorithmState(state);
        setIsRunning(true);
        setIsAnalyzing(false);
    };

    const handleStartAnalysis = () => {
        if (!finalState) return;
        
        // 创建新的算法状态用于分析
        const state = Dijkstra.findShortestPath(graph, startNode);
        setAlgorithmState(state);
        
        // 重要：直接设置为初始状态（第一步）
        state.reset();  // 需要在 AlgorithmState 中添加这个方法
        setCurrentStep(state.getCurrentStep());
        
        setIsAnalyzing(true);
        setIsRunning(false);
        
        // 清除自动播放
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            setAutoPlayInterval(null);
        }
    };

    const handleAutoPlay = () => {
        if (!algorithmState) return;
        
        if (autoPlayInterval) {
            // 如果已经在播放，则停止
            clearInterval(autoPlayInterval);
            setAutoPlayInterval(null);
            return;
        }

        // 开始自动播放
        const playNextStep = () => {
            const nextStep = algorithmState.nextStep();
            if (!nextStep) {
                // 如果没有下一步，停止播放并显示最终结果
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    setAutoPlayInterval(null);
                }
                setIsRunning(true);
                return;
            }
            setCurrentStep(nextStep);
        };

        // 设置定时器
        const interval = setInterval(playNextStep, autoPlaySpeed);
        setAutoPlayInterval(interval);
    };

    const handleNextStep = () => {
        if (algorithmState) {
            const step = algorithmState.nextStep();
            if (step) {
                setCurrentStep(step);
            } else {
                setIsRunning(false);
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    setAutoPlayInterval(null);
                }
            }
        }
    };

    const handlePreviousStep = () => {
        if (algorithmState) {
            const step = algorithmState.previousStep();
            if (step) {
                setCurrentStep(step);
            }
            // 如果正在自动播放，停止它
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                setAutoPlayInterval(null);
            }
        }
    };

    // 确保在组件卸载时清理定时器
    useEffect(() => {
        return () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        };
    }, [autoPlayInterval]);

    const handleReset = () => {
        // 保留图结构，只重置算法相关状态
        setAlgorithmState(null);
        setCurrentStep(null);
        setIsRunning(false);
        setIsAnalyzing(false);
        setFinalState(null);
        
        // 重置自动播放状态
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            setAutoPlayInterval(null);
        }
        
        // 重置起始节点和播放速度为默认值
        setStartNode(1);
        setAutoPlaySpeed(1000);
    };

    return (
        <div className="app">
            <a href="https://github.com/DeNeRATe-cool" 
               className="github-corner" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="View source on GitHub">
                <svg width="80" height="80" viewBox="0 0 250 250" 
                     style={{ fill: '#151513', color: '#fff', position: 'absolute', top: 0, border: 0, right: 0 }} 
                     aria-hidden="true">
                    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                    <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" 
                          fill="currentColor" 
                          style={{ transformOrigin: '130px 106px' }} 
                          className="octo-arm">
                    </path>
                    <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" 
                          fill="currentColor" 
                          className="octo-body">
                    </path>
                </svg>
            </a>
            <div className="header">
                <h1>Dijkstra算法可视化</h1>
                <div className="status-info">
                    当前节点数：{nodeCount}，当前边数：{edges.length}
                </div>
            </div>
            <div className="main-content">
                <div className="visualization-panel">
                    <div className="graph-container">
                        <GraphVisualization
                            nodes={nodeCount}
                            edges={edges}
                            currentStep={currentStep}
                            isRunning={isRunning}
                            isAnalyzing={isAnalyzing}
                        />
                    </div>
                    {currentStep && (
                        <div className="algorithm-status">
                            <h3>当前步骤</h3>
                            <p className="step-description">{currentStep.description}</p>
                        </div>
                    )}
                </div>
                <div className="control-container">
                    <ControlPanel
                        onAddNode={handleAddNode}
                        onAddEdge={handleAddEdge}
                        onRunAlgorithm={handleRunAlgorithm}
                        onStartAnalysis={handleStartAnalysis}
                        onNextStep={handleNextStep}
                        onPreviousStep={handlePreviousStep}
                        onReset={handleReset}
                        onAutoPlay={handleAutoPlay}
                        startNode={startNode}
                        onStartNodeChange={setStartNode}
                        autoPlaySpeed={autoPlaySpeed}
                        onSpeedChange={setAutoPlaySpeed}
                        isRunning={isRunning}
                        autoPlayInterval={autoPlayInterval}
                        isAnalyzing={isAnalyzing}
                    />
                    <div className="terminal">
                        <div className="terminal-header">
                            <h3>算法执行日志</h3>
                        </div>
                        <div className="terminal-content">
                            {currentStep && (
                                <div className="distances">
                                    <h4>当前最短距离：</h4>
                                    <div className="distance-grid">
                                        {Array.from({ length: nodeCount }, (_, i) => i + 1).map(node => (
                                            <div key={node} className="distance-item">
                                                <span className="node-label">节点 {node}:</span>
                                                <span className="distance-value">
                                                    {currentStep.distances.get(node) === Infinity 
                                                        ? "∞" 
                                                        : currentStep.distances.get(node)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <div className="copyright">
                    © {new Date().getFullYear()} DeNeRATe. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default App; 