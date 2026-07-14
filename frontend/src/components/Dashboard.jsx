import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
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
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const postsData = response.data.results || response.data || [];
      setPosts(postsData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      } else {
        setError('Failed to load posts. Please try again.');
      }
      setPosts([]);
      setLoading(false);
    });
  }, [token, navigate]);

  // --- FIX: Delete using slug instead of id ---
  const handleDelete = async (postSlug) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/api/posts/${postSlug}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Remove the deleted post from the list
      setPosts(posts.filter(post => post.slug !== postSlug));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

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
        <h2 className="mt-3">Loading posts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>⚠️ Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(posts)) {
    console.error('Posts is not an array:', posts);
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>⚠️ Data Error</h4>
          <p>Could not load posts. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/dashboard/create">
            <button className="btn btn-success me-2">
              + New Post
            </button>
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No posts yet. Create your first post!</td>
              </tr>
            )}
            {posts.map(post => (
              <tr key={post.id}>
                <td>
                  <Link to={`/post/${post.slug}`} className="text-decoration-none">
                    {post.title}
                  </Link>
                </td>
                <td>
                  <span className={`badge ${post.status === 'published' ? 'bg-success' : 'bg-warning'}`}>
                    {post.status}
                  </span>
                </td>
                <td>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}</td>
                <td>
                  <Link to={`/dashboard/edit/${post.slug}`} className="btn btn-primary btn-sm me-2">
                    Edit
                  </Link>
                  {/* --- FIX: Pass post.slug to delete function --- */}
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDelete(post.slug)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;