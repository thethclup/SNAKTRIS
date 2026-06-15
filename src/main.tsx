import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { OnchainProvider } from './components/OnchainProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnchainProvider>
      <App />
    </OnchainProvider>
  </StrictMode>,
);
