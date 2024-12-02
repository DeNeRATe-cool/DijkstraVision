import React, { useState } from 'react';

interface ControlPanelProps {
    onAddNode: () => void;
    onAddEdge: (from: number, to: number, weight: number) => void;
    onRunAlgorithm: () => void;
    onStartAnalysis: () => void;
    onNextStep: () => void;
    onPreviousStep: () => void;
    onReset: () => void;
    onAutoPlay: () => void;
    startNode: number;
    onStartNodeChange: (node: number) => void;
    autoPlaySpeed: number;
    onSpeedChange: (speed: number) => void;
    isRunning: boolean;
    isAnalyzing: boolean;
    autoPlayInterval: NodeJS.Timeout | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    onAddNode,
    onAddEdge,
    onRunAlgorithm,
    onStartAnalysis,
    onNextStep,
    onPreviousStep,
    onReset,
    onAutoPlay,
    startNode,
    onStartNodeChange,
    autoPlaySpeed,
    onSpeedChange,
    isRunning,
    isAnalyzing,
    autoPlayInterval
}) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [weight, setWeight] = useState('');

    const handleAddEdge = () => {
        const fromNum = parseInt(from);
        const toNum = parseInt(to);
        const weightNum = parseInt(weight);

        if (!isNaN(fromNum) && !isNaN(toNum) && !isNaN(weightNum)) {
            onAddEdge(fromNum, toNum, weightNum);
            setFrom('');
            setTo('');
            setWeight('');
        }
    };

    return (
        <div className="control-panel">
            <div className="panel-section">
                <h3>图编辑</h3>
                <div className="edge-input">
                    <div className="input-group">
                        <label htmlFor="from">起始节点</label>
                        <input
                            id="from"
                            type="number"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="输入起始节点编号"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="to">目标节点</label>
                        <input
                            id="to"
                            type="number"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="输入目标节点编号"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="weight">边权重</label>
                        <input
                            id="weight"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="输入边的权重"
                        />
                    </div>
                </div>
                <div className="edit-controls">
                    <button 
                        onClick={onAddNode}
                        className="control-button"
                    >
                        <span className="button-icon">+</span>
                        添加节点
                    </button>
                    <button 
                        onClick={handleAddEdge}
                        disabled={!from || !to || !weight}
                        className="control-button"
                    >
                        <span className="button-icon">↗</span>
                        添加边
                    </button>
                    <button 
                        onClick={onReset}
                        className="control-button"
                    >
                        <span className="button-icon">↺</span>
                        重置
                    </button>
                </div>
            </div>
            
            <div className="panel-section">
                <h3>算法设置</h3>
                <div className="algorithm-settings">
                    <div className="input-group">
                        <label htmlFor="startNode">Dijkstra 起始节点</label>
                        <input
                            id="startNode"
                            type="number"
                            value={startNode}
                            onChange={(e) => onStartNodeChange(parseInt(e.target.value))}
                            placeholder="选择算法起始节点"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="speed">自动播放速度 (ms)</label>
                        <input
                            id="speed"
                            type="number"
                            value={autoPlaySpeed}
                            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                            placeholder="设置播放速度(毫秒)"
                            min="100"
                            max="5000"
                            step="100"
                        />
                    </div>
                </div>
            </div>
            
            <div className="panel-section algorithm-control-section">
                <h3>算法控制</h3>
                <div className={`algorithm-controls ${isAnalyzing ? 'analyzing' : ''}`}>
                    {!isAnalyzing ? (
                        <>
                            <button 
                                onClick={onRunAlgorithm}
                                className="control-button primary-button"
                            >
                                <span className="button-icon">▶</span>
                                运行算法
                            </button>
                            <button 
                                onClick={onStartAnalysis}
                                disabled={!isRunning}
                                className="control-button secondary-button"
                            >
                                <span className="button-icon">🔍</span>
                                过程分析
                            </button>
                        </>
                    ) : (
                        <div className="analysis-controls">
                            <button 
                                onClick={onPreviousStep}
                                className="control-button"
                            >
                                <span className="button-icon">⏮</span>
                                上一步
                            </button>
                            <button 
                                onClick={onNextStep}
                                className="control-button"
                            >
                                <span className="button-icon">⏭</span>
                                下一步
                            </button>
                            <button 
                                onClick={onAutoPlay}
                                className="control-button"
                            >
                                <span className="button-icon">
                                    {autoPlayInterval ? '⏸' : '▶'}
                                </span>
                                {autoPlayInterval ? '暂停播放' : '自动播放'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ControlPanel; 