// toolbar.js
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div className="node-library">
      <div className="node-library-inner">
        <span className="node-library-label">
          Node<br />Library
        </span>
        <div className="node-library-divider" />
        <div className="node-library-items">
          <DraggableNode type="customInput" label="Input" />
          <DraggableNode type="text" label="Text" />
          <DraggableNode type="math" label="Math" />
          <DraggableNode type="filter" label="Filter" />
          <DraggableNode type="merge" label="Merge" />
          <DraggableNode type="llm" label="LLM" />
          <DraggableNode type="apiRequest" label="API Request" />
          <DraggableNode type="timer" label="Timer" />
          <DraggableNode type="customOutput" label="Output" />
        </div>
      </div>
    </div>
  );
};