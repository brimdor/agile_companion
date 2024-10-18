import React, { useContext } from 'react';
import { SettingsContext } from '../SettingsContext';

const SettingsMenu = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleThemeChange = (e) => {
    setSettings({ ...settings, theme: e.target.value });
  };

  const handleFontSizeChange = (e) => {
    setSettings({ ...settings, fontSize: e.target.value });
  };

  const handleColorSchemeChange = (e) => {
    setSettings({ ...settings, colorScheme: e.target.value });
  };

  const toggleHighContrast = () => {
    setSettings({ ...settings, highContrast: !settings.highContrast });
  };

  return (
    <div className="settings-menu">
      <h2>Settings</h2>
      <div>
        <label>Theme:</label>
        <select value={settings.theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div>
        <label>Font Size:</label>
        <select value={settings.fontSize} onChange={handleFontSizeChange}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label>Color Scheme:</label>
        <select value={settings.colorScheme} onChange={handleColorSchemeChange}>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
        </select>
      </div>
      <div>
        <label>High Contrast:</label>
        <input
          type="checkbox"
          checked={settings.highContrast}
          onChange={toggleHighContrast}
        />
      </div>
    </div>
  );
};

export default SettingsMenu;
