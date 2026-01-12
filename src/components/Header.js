import React from 'react';
import '../styles/Header.css';

function Header({ currentPage, onPageChange }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🛡️ Nigerian Security News Platform</h1>
          <p>Automated Security Intelligence Feed</p>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${currentPage === 'feed' ? 'active' : ''}`}
            onClick={() => onPageChange('feed')}
          >
            📰 News Feed
          </button>
          <button
            className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => onPageChange('analytics')}
          >
            📊 Analytics
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
