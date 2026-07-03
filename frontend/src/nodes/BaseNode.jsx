// nodes/BaseNode.jsx
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ updateNodeField: state.updateNodeField, deleteNode: state.deleteNode });

const MAX_TEXTAREA_WIDTH = 400;
const MIN_TEXTAREA_WIDTH = 180;

// Measures the widest line of text using an offscreen canvas so we can size
// the textarea to fit its content, capped at MAX_TEXTAREA_WIDTH.
const measureTextWidth = (text, font) => {
  const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement('canvas'));
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const lines = text.split('\n');
  return Math.max(...lines.map((line) => ctx.measureText(line || ' ').width));
};

export const BaseNode = ({ id, data, selected, config }) => {
  const { updateNodeField, deleteNode } = useStore(selector, shallow);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRefs = useRef({});

  const [values, setValues] = useState(
    () => Object.fromEntries(config.fields.map(f => [f.name, data?.[f.name] ?? f.default]))
  );

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    updateNodeField(id, name, value);
  };

  const allHandles = config.computeHandles ? config.computeHandles(values) : config.handles;

  // Variable handles (dynamic, from {{...}} detection) only render when the node is selected.
  // Static handles (source/output, LLM ports, etc.) always render.
  const visibleHandles = allHandles.filter((h) => !h.variable || selected);

  // Re-measure handle positions whenever the visible set changes (selection toggle,
  // or the underlying text edits add/remove variables).
  useEffect(() => {
    updateNodeInternals(id);
  }, [visibleHandles.length, selected, id, updateNodeInternals]);

  // Auto-resize textareas: height fits content, width fits the longest line up to a cap
  useEffect(() => {
    Object.entries(textareaRefs.current).forEach(([name, el]) => {
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;

      const font = window.getComputedStyle(el).font;
      const contentWidth = measureTextWidth(values[name] || '', font) + 24; // padding allowance
      const width = Math.min(MAX_TEXTAREA_WIDTH, Math.max(MIN_TEXTAREA_WIDTH, contentWidth));
      el.style.width = `${width}px`;
    });
  }, [values]);

  // Auto-close "{{" -> "{{}}" with cursor placed in between, code-editor style
  const handleTextareaChange = (name, e) => {
    const el = e.target;
    const newValue = el.value;
    const prevValue = values[name] || '';
    const cursorPos = el.selectionStart;

    const isSingleInsert = newValue.length === prevValue.length + 1;
    const insertedChar = isSingleInsert ? newValue[cursorPos - 1] : null;
    const charBefore = isSingleInsert ? newValue[cursorPos - 2] : null;

    if (isSingleInsert && insertedChar === '{' && charBefore === '{') {
      const withClose = newValue.slice(0, cursorPos) + '}}' + newValue.slice(cursorPos);
      handleChange(name, withClose);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = cursorPos;
      });
      return;
    }

    handleChange(name, newValue);
  };

  return (
    <div className={`node-container ${selected ? 'is-selected' : ''}`}>
      <button
        type="button"
        className="node-delete"
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        title="Delete node"
      >
        ×
      </button>

      <div className="node-header">{config.title}</div>

      <div className="node-body">
        {config.fields.map(field => (
          <div className="node-field" key={field.name}>
            {field.label && <label className="node-field-label">{field.label}</label>}
            {field.type === 'select' ? (
              <select
                className="nodrag"
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                {field.options.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                ref={(el) => (textareaRefs.current[field.name] = el)}
                className="nodrag"
                value={values[field.name]}
                onChange={(e) => handleTextareaChange(field.name, e)}
                rows={1}
              />
            ) : (
              <input
                type="text"
                className="nodrag"
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {visibleHandles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position === 'left' ? Position.Left : Position.Right}
          id={`${id}-${h.id}`}
          style={h.style}
        >
          {h.label && h.position === 'left' && (
            <span className="node-handle-label node-handle-label-left">{h.label}</span>
          )}
        </Handle>
      ))}
    </div>
  );
};