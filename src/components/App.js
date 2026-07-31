import React, { useState, useEffect, useMemo } from 'react';
import './styles.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [filteredUserId, setFilteredUserId] = useState('');
  const [fetchCount, setFetchCount] = useState(0);

  // Memoized API call - only re-fetches when filteredUserId changes
  const fetchData = useMemo(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      setFetchCount(prev => prev + 1);
      
      try {
        const url = filteredUserId 
          ? `https://jsonplaceholder.typicode.com/posts?userId=${filteredUserId}`
          : 'https://jsonplaceholder.typicode.com/posts';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setPosts([]);
      }
    };

    return fetchPosts;
  }, [filteredUserId]); // Only re-create when filteredUserId changes

  // Trigger data fetch when component mounts or filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = () => {
    const userIdNum = parseInt(userId);
    if (userId && (isNaN(userIdNum) || userIdNum < 1 || userIdNum > 10)) {
      alert('Please enter a valid User ID (1-10)');
      return;
    }
    setFilteredUserId(userId);
  };

  const handleReset = () => {
    setUserId('');
    setFilteredUserId('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  return (
    <div className="app-container">
      <h1>📡 Cached API with useMemo</h1>
      <p className="subtitle">Data is cached and only re-fetched when filters change</p>

      {/* Filter Controls */}
      <div className="controls">
        <div className="filter-group">
          <input
            type="text"
            className="filter-input"
            placeholder="Filter by User ID (1-10)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-filter" onClick={handleFilter}>
            Apply Filter
          </button>
          <button className="btn btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
        <div className="stats">
          <span className="stat-item">
            📊 Total Posts: <strong>{posts.length}</strong>
          </span>
          <span className="stat-item">
            🔄 API Calls: <strong>{fetchCount}</strong>
          </span>
          {filteredUserId && (
            <span className="stat-item stat-filter">
              🎯 Filtered by User: <strong>{filteredUserId}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-container">
          <p className="error-message">❌ Error: {error}</p>
          <button className="btn btn-retry" onClick={() => setFilteredUserId(filteredUserId)}>
            Retry
          </button>
        </div>
      )}

      {/* Posts Display */}
      {!loading && !error && (
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>📭 No posts found</p>
              <p className="empty-hint">Try adjusting your filter</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <span className="post-id">#{post.id}</span>
                    <span className="post-user">User {post.userId}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-body">{post.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="footer">
        <p>💡 Data is memoized using useMemo - only re-fetches when filter changes</p>
        <p className="footer-hint">API Calls: {fetchCount} | Posts: {posts.length}</p>
      </div>
    </div>
  );
}

export default App;
