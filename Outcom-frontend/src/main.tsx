
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { SolanaProvider } from './providers/SolanaProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SolanaProvider>
        <App />
      </SolanaProvider>
    </BrowserRouter>
  </StrictMode>,
);
