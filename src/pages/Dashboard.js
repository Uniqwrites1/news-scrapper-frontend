import React, { useEffect, useState } from 'react';
import { articleAPI } from '../api/articleAPI';
import '../styles/Dashboard.css';

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchStatistics();
  }, [days]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await articleAPI.getStatistics(days);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading statistics...</div>;
  }

  if (!statistics) {
    return <div className="dashboard-error">Failed to load statistics</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Security News Analytics</h1>
        <div className="time-filter">
          <label>Period: </label>
          <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-number">{statistics.total_articles}</div>
          <div className="stat-label">Total Security Articles</div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-number">{statistics.by_source.length}</div>
          <div className="stat-label">News Sources Tracked</div>
        </div>
        <div className="stat-card tertiary">
          <div className="stat-number">{statistics.top_locations.length}</div>
          <div className="stat-label">Affected Locations</div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card">
          <h3>📰 Articles by Source</h3>
          <ul className="source-list">
            {statistics.by_source.map((item) => (
              <li key={item.source}>
                <span>{item.source.replace(/_/g, ' ').toUpperCase()}</span>
                <span className="count">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>🚨 Incident Types</h3>
          <ul className="incident-list">
            {statistics.by_incident_type.map((item) => (
              <li key={item.type}>
                <span>{item.type.replace(/_/g, ' ').toUpperCase()}</span>
                <span className="count">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card full-width">
          <h3>📍 Top Affected Locations</h3>
          <div className="location-list">
            {statistics.top_locations.map((item, index) => (
              <div key={item.location} className="location-item">
                <span className="rank">#{index + 1}</span>
                <span className="location-name">{item.location}</span>
                <div className="location-bar">
                  <div
                    className="location-bar-fill"
                    style={{
                      width:
                        (item.count /
                          Math.max(
                            ...statistics.top_locations.map((l) => l.count)
                          )) *
                        100 +
                        '%',
                    }}
                  ></div>
                </div>
                <span className="location-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
