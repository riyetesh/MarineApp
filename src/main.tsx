if (typeof window !== 'undefined') {
  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  }
  try {
    const origFetch = window.fetch ? window.fetch.bind(window) : null;
    let _fetch = origFetch;
    Object.defineProperty(window, 'fetch', {
      get: () => _fetch,
      set: (val) => { _fetch = val; },
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    // Already defined or patched
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
