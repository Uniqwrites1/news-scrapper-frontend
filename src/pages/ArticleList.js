import React, { useState, useEffect } from 'react';
import { articleAPI } from '../api/articleAPI';
import '../styles/ArticleList.css';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState('');
  const [filters, setFilters] = useState({
    source: '',
    location: '',
    incident_type: '',
    days: 7,
  });
  const [sources, setSources] = useState([]);
  const [locations, setLocations] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });

  useEffect(() => {
    fetchMetadata();
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination]);

  const fetchMetadata = async () => {
    try {
      const [sourcesRes, locationsRes, typesRes] = await Promise.all([
        articleAPI.getSources(),
        articleAPI.getLocations(),
        articleAPI.getIncidentTypes(),
      ]);
      setSources(sourcesRes.data.sources || []);
      setLocations(locationsRes.data.locations || []);
      setIncidentTypes(typesRes.data.incident_types || []);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        skip: pagination.skip,
        limit: pagination.limit,
        days: filters.days,
      };
      if (filters.source) params.source = filters.source;
      if (filters.location) params.location = filters.location;
      if (filters.incident_type) params.incident_type = filters.incident_type;

      const response = await articleAPI.getArticles(params);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination({ skip: 0, limit: 10 });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIncidentIcon = (type) => {
    const icons = {
      kidnapping: '🚨',
      armed_robbery: '🔫',
      terrorism: '💣',
      homicide: '⚠️',
      cultism: '💀',
      military_operation: '🪖',
      communal_conflict: '⚔️',
    };
    return icons[type] || '📰';
  };

  const triggerScrape = async () => {
    try {
      setScraping(true);
      setScrapeMessage('');
      setScrapeMessage('⏳ Scraping in progress... fetching latest security news...');
      
      await articleAPI.triggerScrape();
      
      setScrapeMessage('✅ Scraping completed successfully! Updating articles...');
      setTimeout(() => {
        fetchArticles();
        setScraping(false);
        setScrapeMessage('');
      }, 1500);
    } catch (error) {
      setScrapeMessage('❌ Error: ' + error.message);
      setScraping(false);
      setTimeout(() => setScrapeMessage(''), 5000);
    }
  };

  return (
    <div className="article-list">
      <div className="article-header">
        <h1>🔍 Security News Feed</h1>
        <button 
          className={`scrape-btn ${scraping ? 'scraping' : ''}`} 
          onClick={triggerScrape}
          disabled={scraping}
        >
          {scraping ? '⚙️ Scraping...' : '🔄 Scrape Now'}
        </button>
      </div>

      {scrapeMessage && (
        <div className={`scrape-message ${scrapeMessage.includes('✅') ? 'success' : scrapeMessage.includes('❌') ? 'error' : 'loading'}`}>
          {scrapeMessage}
        </div>
      )}

      <div className="filters">
        <select
          name="days"
          value={filters.days}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>

        <select
          name="source"
          value={filters.source}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Sources</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          name="incident_type"
          value={filters.incident_type}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Incident Types</option>
          {incidentTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="no-articles">No articles found</div>
      ) : (
        <>
          <div className="articles">
            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-header-card">
                  <span className="incident-icon">
                    {getIncidentIcon(article.incident_type)}
                  </span>
                  <h3>{article.title}</h3>
                </div>

                <div className="article-metadata">
                  <span className="source-badge">{article.source}</span>
                  <span className="date">{formatDate(article.published_date)}</span>
                </div>

                <p className="summary">{article.summary.substring(0, 200)}...</p>

                {article.locations && article.locations.length > 0 && (
                  <div className="locations">
                    {article.locations.map((loc) => (
                      <span key={loc} className="location-tag">
                        📍 {loc}
                      </span>
                    ))}
                  </div>
                )}

                <div className="incident-type">
                  <strong>Type:</strong> {article.incident_type.replace(/_/g, ' ')}
                </div>

                <a href={article.link} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read Full Article →
                </a>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  skip: Math.max(0, prev.skip - prev.limit),
                }))
              }
              disabled={pagination.skip === 0}
            >
              ← Previous
            </button>
            <span>
              Page {Math.floor(pagination.skip / pagination.limit) + 1}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  skip: prev.skip + prev.limit,
                }))
              }
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ArticleList;
