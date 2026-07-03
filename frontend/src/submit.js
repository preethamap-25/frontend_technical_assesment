// submit.js
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error('Request failed');
      setResult(await res.json());
    } catch {
      setError('Could not reach the backend. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => { setResult(null); setError(null); };

  return (
    <>
      <button
        type="button"
        className={`submit-button ${loading ? 'is-loading' : ''}`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Analyzing…' : 'Submit Pipeline →'}
      </button>

      {(result || error) && (
        <div className="toast-overlay" onClick={dismiss}>
          <div className="toast-card" onClick={(e) => e.stopPropagation()}>
            <button className="toast-close" onClick={dismiss}>×</button>
            {error ? (
              <>
                <div className="toast-label">Error</div>
                <div className="toast-message">{error}</div>
              </>
            ) : (
              <>
                <div className="toast-label">Pipeline Analysis</div>
                <div className="toast-stats">
                  <div className="toast-stat">
                    <span className="toast-stat-value">{result.num_nodes}</span>
                    <span className="toast-stat-key">Nodes</span>
                  </div>
                  <div className="toast-stat">
                    <span className="toast-stat-value">{result.num_edges}</span>
                    <span className="toast-stat-key">Edges</span>
                  </div>
                  <div className={`toast-stat toast-dag ${result.is_dag ? 'is-valid' : 'is-invalid'}`}>
                    <span className="toast-stat-value">{result.is_dag ? '✓' : '✕'}</span>
                    <span className="toast-stat-key">{result.is_dag ? 'Valid DAG' : 'Contains Cycle'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};