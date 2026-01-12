import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ArticleList from './pages/ArticleList';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('feed');

  return (
    <div className="App">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'feed' && (
          <>
            <ArticleList onNavigate={() => setCurrentPage('analytics')} />
          </>
        )}
        {currentPage === 'analytics' && (
          <>
            <Dashboard onNavigate={() => setCurrentPage('feed')} />
          </>
        )}
      </main>
      <footer className="footer">
        <p>Nigerian Security News Platform • Automated Security Intelligence</p>
      </footer>
    </div>
  );
}

export default App;
