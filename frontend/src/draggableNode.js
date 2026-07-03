// draggableNode.js
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { buildNode } from './nodes/buildNode';

const selector = (state) => ({
  nodes: state.nodes,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
});

export const DraggableNode = ({ type, label }) => {
  const { nodes, getNodeID, addNode } = useStore(selector, shallow);

  const handleClick = () => {
    const cascade = nodes.length % 8;
    const position = { x: 400 + cascade * 32, y: 200 + cascade * 32 };
    addNode(buildNode(type, position, getNodeID));
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