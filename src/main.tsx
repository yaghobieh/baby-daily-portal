import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@forgedevstack/bear/styles.css';
import { BearProvider } from '@forgedevstack/bear';
import { LingoProvider } from '@forgedevstack/lingo';
import { lingo } from './lingo/lingo';
import { babyDailyTheme, babyDailyVariants } from './config/bear-theme';
import { App } from './App';
import './styles/index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <LingoProvider instance={lingo}>
          <BearProvider
            defaultMode="light"
            theme={babyDailyTheme}
            customVariants={babyDailyVariants}
          >
            <App />
          </BearProvider>
        </LingoProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
