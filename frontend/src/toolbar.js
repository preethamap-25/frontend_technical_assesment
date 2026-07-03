// toolbar.js
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <div className="toolbar-label">Node Library</div>
      <div className="toolbar-nodes">
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="math" label="Math" />
        <DraggableNode type="filter" label="Filter" />
        <DraggableNode type="apiRequest" label="API Request" />
        <DraggableNode type="timer" label="Timer" />
        <DraggableNode type="merge" label="Merge" />
      </div>
      <div className="separator">
        <span className="line"></span>
        <span className="diamond"></span>
        <span className="line"></span>
      </div>
    </div>
  );
};