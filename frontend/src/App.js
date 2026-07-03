// App.js
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app-shell">
      <PipelineUI />
      <PipelineToolbar />
      <SubmitButton />
    </div>
  );
}

export default App;