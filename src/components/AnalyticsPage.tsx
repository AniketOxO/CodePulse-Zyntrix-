import { useEffect, useState } from 'react';
import { analyticsApi, AnalyticsSummary } from '../services/api';
import { RefreshCw, Trash2, Activity, Calendar, Clock, BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await analyticsApi.recordSync();
      await loadAnalytics();
    } catch (error) {
      console.error('Failed to record sync:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all analytics data?')) return;
    try {
      await analyticsApi.reset();
      await loadAnalytics();
    } catch (error) {
      console.error('Failed to reset analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="dashboard-heading">
          <h1>Analytics</h1>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="dashboard-heading">
        <div>
          <h1>Analytics</h1>
          <p>Track your CodePulse usage and sync activity.</p>
        </div>
        <div className="analytics-actions">
          <button className="btn btn-ghost" onClick={handleReset}>
            <Trash2 size={16} />
            Reset Data
          </button>
          <button
            className="btn btn-primary btn-elevated"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw size={16} className={syncing ? 'spinning' : ''} />
            {syncing ? 'Syncing...' : 'Manual Sync'}
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <article className="panel analytics-card">
          <div className="analytics-icon">
            <Activity size={24} />
          </div>
          <div className="analytics-data">
            <p>Total Requests</p>
            <strong>{summary?.totalRequests ?? 0}</strong>
          </div>
        </article>

        <article className="panel analytics-card">
          <div className="analytics-icon">
            <RefreshCw size={24} />
          </div>
          <div className="analytics-data">
            <p>Total Syncs</p>
            <strong>{summary?.totalSyncs ?? 0}</strong>
          </div>
        </article>

        <article className="panel analytics-card">
          <div className="analytics-icon">
            <Calendar size={24} />
          </div>
          <div className="analytics-data">
            <p>Today's Requests</p>
            <strong>{summary?.todayRequests ?? 0}</strong>
          </div>
        </article>

        <article className="panel analytics-card">
          <div className="analytics-icon">
            <Clock size={24} />
          </div>
          <div className="analytics-data">
            <p>Last Sync</p>
            <strong>
              {summary?.lastSyncTime
                ? new Date(summary.lastSyncTime).toLocaleString()
                : 'Never'}
            </strong>
          </div>
        </article>
      </div>

      <section className="panel analytics-info">
        <div className="panel-head">
          <h3>Usage Overview</h3>
          <BarChart2 size={18} />
        </div>
        <div className="analytics-details">
          <p>
            CodePulse tracks your repository sync activity and API usage to help you
            understand your development patterns. Use the manual sync button to
            trigger a sync and update your analytics.
          </p>
          <ul>
            <li>
              <strong>Total Requests:</strong> All API calls made to the CodePulse backend
            </li>
            <li>
              <strong>Total Syncs:</strong> Number of times data was synced from GitHub
            </li>
            <li>
              <strong>Today's Requests:</strong> API calls made in the current day
            </li>
            <li>
              <strong>Last Sync:</strong> Timestamp of the most recent data sync
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
