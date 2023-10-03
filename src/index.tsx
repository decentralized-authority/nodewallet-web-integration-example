import './react-app-env.d.ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/sakura-dark.css';
import './index.css';
import { App } from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);
