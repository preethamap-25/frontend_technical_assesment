// ui.js
import { useRef, useState, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeConfigs } from './nodes/nodesConfig';
import {
  InputNode, OutputNode, LLMNode, TextNode,
  MathNode, FilterNode, ApiRequestNode, TimerNode, MergeNode,
} from './nodes/createNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  math: MathNode,
  filter: FilterNode,
  apiRequest: ApiRequestNode,
  timer: TimerNode,
  merge: MergeNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw || !reactFlowInstance) return;

      const { nodeType } = JSON.parse(raw);
      if (!nodeType) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(nodeType);
      const config = nodeConfigs[nodeType];
      const defaults = config
        ? Object.fromEntries(config.fields.map((f) => [f.name, f.default]))
        : {};

      addNode({
        id: nodeID,
        type: nodeType,
        position,
        data: { id: nodeID, nodeType, ...defaults },
      });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="pipeline-canvas" ref={reactFlowWrapper}>
      {nodes.length === 0 && (
        <div className="canvas-empty-state">
          <div className="canvas-empty-state-title">Start building your pipeline</div>
          <div className="canvas-empty-state-sub">Click or drag a node above onto the canvas</div>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        deleteKeyCode={['Backspace', 'Delete']}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
      >
        <Background variant="dots" color="#B8AD91" gap={gridSize} size={1.4} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor="#14161C"
          nodeStrokeWidth={0}
          maskColor="rgba(246, 241, 231, 0.55)"
          style={{ width: 160, height: 110 }}
        />
      </ReactFlow>
    </div>
  );
};