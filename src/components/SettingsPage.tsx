import { useEffect, useState } from 'react';
import { settingsApi, UserSettings } from '../services/api';
import { Save, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface SettingsPageProps {
  onSettingsChange?: (settings: UserSettings) => void;
}

export default function SettingsPage({ onSettingsChange }: SettingsPageProps) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.get();
      setSettings(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const updated = await settingsApi.update(settings);
      setSettings(updated);
      onSettingsChange?.(updated);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const defaults = await settingsApi.reset();
      setSettings(defaults);
      onSettingsChange?.(defaults);
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="dashboard-heading">
          <h1>Settings</h1>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="settings-page">
        <div className="dashboard-heading">
          <h1>Settings</h1>
          <p>Failed to load settings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="dashboard-heading">
        <h1>Settings</h1>
        <p>Configure your CodePulse preferences and integrations.</p>
      </div>

      {message && (
        <div className={`settings-message ${message.type}`}>
          {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="settings-grid">
        <section className="panel settings-section">
          <h3>Appearance</h3>
          <div className="setting-row">
            <div className="setting-info">
              <label>Theme</label>
              <p>Choose your preferred color scheme</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as 'dark' | 'light')}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label>Language</label>
              <p>Interface language preference</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </section>

        <section className="panel settings-section">
          <h3>Notifications</h3>
          <div className="setting-row">
            <div className="setting-info">
              <label>Enable Notifications</label>
              <p>Receive alerts and updates</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        <section className="panel settings-section">
          <h3>Sync Settings</h3>
          <div className="setting-row">
            <div className="setting-info">
              <label>Auto Sync</label>
              <p>Automatically sync with GitHub repositories</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={(e) => updateSetting('autoSync', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label>Sync Interval (minutes)</label>
              <p>How often to sync data automatically</p>
            </div>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.syncInterval}
              onChange={(e) => updateSetting('syncInterval', parseInt(e.target.value) || 5)}
            />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label>Default Branch</label>
              <p>Primary branch for repository analytics</p>
            </div>
            <input
              type="text"
              value={settings.defaultBranch}
              onChange={(e) => updateSetting('defaultBranch', e.target.value)}
              placeholder="main"
            />
          </div>
        </section>
      </div>

      <div className="settings-actions">
        <button className="btn btn-ghost" onClick={handleReset} disabled={saving}>
          <RotateCcw size={16} />
          Reset to Defaults
        </button>
        <button className="btn btn-primary btn-elevated" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
