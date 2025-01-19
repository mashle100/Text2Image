import React, { useState } from 'react';
import './setting.css'; // Import the CSS file

const Setting = () => {
  const [resolution, setResolution] = useState('1080p');
  const [theme, setTheme] = useState('Light');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert('Settings Saved Successfully!');
  };

  return (
    <div className="modern-settings-container">
      <h1 className="title">Settings</h1>

      <div className="settings-card">
        <div className="settings-item">
          <label htmlFor="resolution" className="settings-label">Resolution</label>
          <select
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="settings-select"
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4K">4K</option>
          </select>
        </div>

        <div className="settings-item">
          <label htmlFor="theme" className="settings-label">Theme</label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="settings-select"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="System">System Default</option>
          </select>
        </div>

        <div className="settings-item">
          <div className="checkbox-container">
            <input
              id="notifications"
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="settings-checkbox"
            />
            <label htmlFor="notifications" className="checkbox-label">
              Enable Notifications
            </label>
          </div>
        </div>

        <button className="settings-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Setting;
