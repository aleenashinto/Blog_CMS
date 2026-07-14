import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/categories/')
      .then(response => {
        // Handle both array and paginated responses
        const categoriesData = response.data.results || response.data || [];
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
        setCategories([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">📂 Categories</h5>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">📂 Categories</h5>
          <p className="text-danger">Could not load categories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">📂 Categories</h5>
        <ul className="list-unstyled mb-0">
          <li className="mb-2">
            <Link to="/" className="text-decoration-none">
              📰 All Posts
            </Link>
          </li>
          {categories.map(category => (
            <li key={category.id} className="mb-2">
              <Link 
                to={`/category/${category.slug}`} 
                className="text-decoration-none"
              >
                📁 {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;