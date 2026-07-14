import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/api/posts/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      const postsData = response.data.results || response.data || [];
      if (postsData.length > 0) {
        setUser({ username: postsData[0].author_name });
      } else {
        setUser({ username: 'User' });
      }
      setPosts(Array.isArray(postsData) ? postsData : []);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      } else {
        setError('Failed to load profile data.');
      }
      setPosts([]);
      setLoading(false);
    });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

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
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">👤 {user?.username || 'User'}</h2>
              <p className="text-muted">Member since {new Date().toLocaleDateString()}</p>
              <p>Total Posts: <strong>{posts.length}</strong></p>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
              <Link to="/dashboard" className="btn btn-primary ms-2">
                Go to Dashboard
              </Link>
            </div>
          </div>

          <h3 className="mb-3">My Posts</h3>
          {posts.length === 0 && (
            <div className="alert alert-info">You haven't written any posts yet.</div>
          )}
          {posts.map(post => (
            <div key={post.id} className="card mb-3">
              <div className="card-body">
                <h5>
                  <Link to={`/post/${post.slug}`} className="text-decoration-none">
                    {post.title}
                  </Link>
                </h5>
                <p className="text-muted small">
                  {post.status} | {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                </p>
                <Link to={`/dashboard/edit/${post.slug}`} className="btn btn-outline-primary btn-sm me-2">
                  Edit
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

export default Profile;