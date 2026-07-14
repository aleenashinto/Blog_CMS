import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

function CategoryPosts() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch posts filtered by category
    axios.get(`/api/posts/?category__slug=${slug}`)
      .then(response => {
        const postsData = response.data.results || response.data || [];
        setPosts(Array.isArray(postsData) ? postsData : []);
        // Also fetch the category name
        return axios.get(`/api/categories/${slug}/`);
      })
      .then(response => {
        setCategory(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching category posts:', error);
        if (error.response && error.response.status === 401) {
          setError('Please log in to view this page.');
          // Redirect to login after a moment
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          setError('Failed to load posts. Please try again.');
        }
        setPosts([]);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>⚠️ Error</h4>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
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
          <h1 className="mb-4">Category: {category?.name || 'Unknown'}</h1>
          {postsList.length === 0 && (
            <div className="alert alert-info">No posts in this category yet.</div>
          )}
          {postsList.map(post => (
            <div key={post.id} className="card mb-3">
              <div className="card-body">
                <h2 className="card-title h4">
                  <Link to={`/post/${post.slug}`} className="text-decoration-none">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted">
                  By {post.author_name} | {new Date(post.published_at).toLocaleDateString()}
                </p>
                <p className="card-text">{post.excerpt}</p>
                <Link to={`/post/${post.slug}`} className="btn btn-primary btn-sm">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default CategoryPosts;