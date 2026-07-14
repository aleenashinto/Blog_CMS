import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/posts/?search=${encodeURIComponent(query)}`);
        // Handle paginated response (Django REST Framework)
        const postsData = response.data.results || response.data || [];
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results. Please try again.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Searching...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>⚠️ Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Ensure posts is always an array
  const postsList = Array.isArray(posts) ? posts : [];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h1 className="mb-4">Search Results for: "{query}"</h1>
          {postsList.length === 0 ? (
            <div className="alert alert-info">No posts found matching your search.</div>
          ) : (
            postsList.map((post) => (
              <div key={post.id} className="card mb-3">
                <div className="card-body">
                  <h2 className="card-title h4">
                    <Link to={`/post/${post.slug}`} className="text-decoration-none">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-muted">
                    By {post.author_name || 'Unknown'} | 
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString()
                      : 'Not published'}
                  </p>
                  <p className="card-text">{post.excerpt}</p>
                  <Link to={`/post/${post.slug}`} className="btn btn-primary btn-sm">
                    Read More →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-md-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default SearchResults;