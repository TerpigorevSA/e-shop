import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/index.scss';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from './app/App';
import { store } from './app/store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);
