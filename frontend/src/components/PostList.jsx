import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`/api/posts/?page=${currentPage}`)
      .then(response => {
        setPosts(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5)); // 5 is PAGE_SIZE
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0); // Scroll to top when page changes
    }
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h1 className="mb-4">📝 My Blog</h1>
          {posts.length === 0 && (
            <div className="alert alert-info">No published posts yet.</div>
          )}
          {posts.map(post => (
            <div key={post.id} className="card mb-3">
              {post.featured_image && (
                <img 
                  src={post.featured_image} 
                  className="card-img-top" 
                  alt={post.title}
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h2 className="card-title h4">
                  <Link to={`/post/${post.slug}`} className="text-decoration-none">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted">
                  By {post.author_name} | {new Date(post.published_at).toLocaleDateString()}
                  {post.category && (
                    <span> | Category: <Link to={`/category/${post.category.slug}`}>{post.category.name}</Link></span>
                  )}
                </p>
                <p className="card-text">{post.excerpt}</p>
                <div className="mb-2">
                  {post.tags.map(tag => (
                    <span key={tag.id} className="badge bg-secondary me-1">
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <Link to={`/post/${post.slug}`} className="btn btn-primary btn-sm">
                  Read More →
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages).keys()].map(num => (
                  <li key={num + 1} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(num + 1)}>
                      {num + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
        <div className="col-md-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default PostList;