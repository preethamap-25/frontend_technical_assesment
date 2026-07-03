// nodes/nodeConfigs.js
export const nodeConfigs = {
  customInput: {
    title: 'Input',
    fields: [
      { name: 'inputName', label: 'Name', type: 'text', default: 'input_1' },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], default: 'Text' },
    ],
    handles: [{ type: 'source', id: 'value', position: 'right' }],
  },
  customOutput: {
    title: 'Output',
    fields: [
      { name: 'outputName', label: 'Name', type: 'text', default: 'output_1' },
      { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'], default: 'Text' },
    ],
    handles: [{ type: 'target', id: 'value', position: 'left' }],
  },
  llm: {
    title: 'LLM',
    fields: [],
    handles: [
      { type: 'target', id: 'system', position: 'left', style: { top: '33%' } },
      { type: 'target', id: 'prompt', position: 'left', style: { top: '66%' } },
      { type: 'source', id: 'response', position: 'right' },
    ],
  },
  text: {
    title: 'Text',
    fields: [{ name: 'text', label: '', type: 'textarea', default: '<input>'  }],
    handles: [],
    computeHandles: (values) => {
      const text = values.text || '';
      const variablePattern = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
      const seen = new Set();
      const matches = [];
      let match;
      while ((match = variablePattern.exec(text)) !== null) {
        const varName = match[1];
        if (!seen.has(varName)) {
          seen.add(varName);
          matches.push(varName);
        }
      }
      const handles = matches.map((varName, i) => ({
        type: 'target',
        id: `var-${varName}`,
        position: 'left',
        style: { top: `${((i + 1) / (matches.length + 1)) * 100}%` },
        label: varName,
        variable: true, // <-- flags this handle as dynamic/hideable
      }));
      handles.push({ type: 'source', id: 'output', position: 'right' }); // always visible
      return handles;
    },
  },

  math: {
    title: 'Math Operation',
    fields: [
      { name: 'operation', label: 'Op', type: 'select', options: ['Add', 'Subtract', 'Multiply', 'Divide'], default: 'Add' },
    ],
    handles: [
      { type: 'target', id: 'a', position: 'left', style: { top: '33%' } },
      { type: 'target', id: 'b', position: 'left', style: { top: '66%' } },
      { type: 'source', id: 'result', position: 'right' },
    ],
  },
  filter: {
    title: 'Filter',
    fields: [
      { name: 'condition', label: 'Condition', type: 'text', default: 'value > 0' },
    ],
    handles: [
      { type: 'target', id: 'input', position: 'left' },
      { type: 'source', id: 'output', position: 'right' },
    ],
  },
  apiRequest: {
    title: 'API Request',
    fields: [
      { name: 'url', label: 'URL', type: 'text', default: 'https://api.example.com' },
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
    ],
    handles: [
      { type: 'target', id: 'trigger', position: 'left' },
      { type: 'source', id: 'response', position: 'right' },
    ],
  },
  timer: {
    title: 'Timer / Delay',
    fields: [
      { name: 'delaySeconds', label: 'Delay (s)', type: 'text', default: '5' },
    ],
    handles: [
      { type: 'target', id: 'trigger', position: 'left' },
      { type: 'source', id: 'done', position: 'right' },
    ],
  },
  merge: {
    title: 'Merge',
    fields: [],
    handles: [
      { type: 'target', id: 'a', position: 'left', style: { top: '25%' } },
      { type: 'target', id: 'b', position: 'left', style: { top: '50%' } },
      { type: 'target', id: 'c', position: 'left', style: { top: '75%' } },
      { type: 'source', id: 'merged', position: 'right' },
    ],
  },
};