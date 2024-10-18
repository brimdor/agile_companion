import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SettingsContext } from './SettingsContext';
import Login from './components/Login';
import TaskBoard from './components/TaskBoard';
import RoleManagement from './components/RoleManagement';
import './App.css'; // Import your CSS file

function App() {
  const { settings } = useContext(SettingsContext);

  return (
    <div className={`app ${settings.theme} ${settings.colorScheme} ${settings.highContrast ? 'high-contrast' : ''}`}>
      <h1 style={{ fontSize: settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '24px' : '18px' }}>
        Welcome to the Task Tracker
      </h1>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/roles" element={<RoleManagement />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
