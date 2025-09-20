import { CheatingLogProvider } from './context/CheatingLogContext';
import Apps from './Apps';
function App() {

  return (
    <CheatingLogProvider>
      <Apps />
    </CheatingLogProvider>
  );
}

export default App;
