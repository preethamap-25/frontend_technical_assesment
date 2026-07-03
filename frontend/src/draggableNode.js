// draggableNode.js
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeConfigs } from './nodes/nodesConfig';

const selector = (state) => ({
  nodes: state.nodes,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
});

export const DraggableNode = ({ type, label }) => {
  const { nodes, getNodeID, addNode } = useStore(selector, shallow);

  const buildNode = (position) => {
    const nodeID = getNodeID(type);
    const config = nodeConfigs[type];
    const defaults = config
      ? Object.fromEntries(config.fields.map((f) => [f.name, f.default]))
      : {};
    return {
      id: nodeID,
      type,
      position,
      data: { id: nodeID, nodeType: type, ...defaults },
    };
  };

  const handleClick = () => {
    const cascade = nodes.length % 8;
    const position = { x: 400 + cascade * 32, y: 200 + cascade * 32 };
    addNode(buildNode(position));
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
    event.currentTarget.classList.add('is-dragging');
  };

  const handleDragEnd = (event) => {
    event.currentTarget.classList.remove('is-dragging');
  };

  return (
    <button
      type="button"
      className="add-node-button"
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {label}
    </button>
  );
};