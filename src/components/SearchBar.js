// frontend/src/components/SearchBar.js
import React, { useState } from 'react';
import { articleAPI } from '../api/articleAPI';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.length < 2) return;
    
    try {
      const response = await articleAPI.search(query);
      setResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search security news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}