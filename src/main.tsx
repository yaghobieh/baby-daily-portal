import React from 'react';
import { createRoot } from 'react-dom/client';
import '@forgedevstack/bear/styles.css';
import { BearProvider } from '@forgedevstack/bear';
import { babyDailyTheme, babyDailyVariants } from './config/bear-theme';
import { App } from './App';
import './styles/index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BearProvider
        defaultMode="light"
        theme={babyDailyTheme}
        customVariants={babyDailyVariants}
      >
        <App />
      </BearProvider>
    </React.StrictMode>
  );
}
