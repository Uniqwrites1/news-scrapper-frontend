import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const articleAPI = {
  getArticles: (params = {}) => {
    return api.get('/api/articles', { params });
  },
  
  getSources: () => {
    return api.get('/api/sources');
  },
  
  getIncidentTypes: () => {
    return api.get('/api/incident-types');
  },
  
  getLocations: () => {
    return api.get('/api/locations');
  },
  
  getStatistics: (days = 7) => {
    return api.get('/api/statistics', { params: { days } });
  },
  
  triggerScrape: () => {
    // Scraping can take up to 60 seconds (10+ news sources)
    return api.post('/api/scrape-now', {}, { timeout: 60000 });
  },
};

export default api;
