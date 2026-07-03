// nodes/createNode.js
import { BaseNode } from './BaseNode';
import { nodeConfigs } from './nodesConfig';

export const createNode = (type) => (props) =>
  <BaseNode {...props} config={nodeConfigs[type]} />;

export const InputNode = createNode('customInput');
export const OutputNode = createNode('customOutput');
export const LLMNode = createNode('llm');
export const TextNode = createNode('text');
export const MathNode = createNode('math');
export const FilterNode = createNode('filter');
export const ApiRequestNode = createNode('apiRequest');
export const TimerNode = createNode('timer');
export const MergeNode = createNode('merge');