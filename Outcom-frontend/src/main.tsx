
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { SolanaProvider } from './providers/SolanaProvider.tsx';
import {Toaster} from "sonner"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SolanaProvider>
        <Toaster/>
        <App />
      </SolanaProvider>
    </BrowserRouter>
  </StrictMode>,
);
