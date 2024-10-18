import React from 'react';
import ReactDOM from 'react-dom';
import { SettingsProvider } from './SettingsContext';
import App from './App';
import SettingsMenu from './components/SettingsMenu';
import './index.css';

ReactDOM.render(
  <SettingsProvider>
    <SettingsMenu />
    <App />
  </SettingsProvider>,
  document.getElementById('root')
);
