import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Comments from './Comments';

function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/posts/${slug}/`)
      .then(response => {
        setPost(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Loading post...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Error</h4>
          <p>{error}</p>
          <hr />
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mt-5 text-center">
        <h2>Post not found!</h2>
        <p className="text-muted">The post you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Back button */}
      <Link to="/" className="btn btn-outline-primary mb-4">
        ← Back to Home
      </Link>

      {/* Post title */}
      <h1 className="display-4 fw-bold mb-3">{post.title}</h1>

      {/* Metadata */}
      <div className="text-muted mb-4 pb-3 border-bottom">
        <span>By <strong>{post.author_name || 'Unknown'}</strong></span>
        <span className="mx-2">•</span>
        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}</span>
        {post.category && (
          <>
            <span className="mx-2">•</span>
            <span>
              Category: 
              <Link to={`/category/${post.category.slug}`} className="ms-1 text-decoration-none">
                {post.category.name}
              </Link>
            </span>
          </>
        )}
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-4">
          <img 
            src={post.featured_image}
            alt={post.title} 
            className="img-fluid rounded shadow-sm"
          />
        </div>
      )}

      {/* Content */}
      <div 
        dangerouslySetInnerHTML={{ __html: post.content }} 
        className="fs-5 lh-lg mb-4"
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 pt-3 border-top">
          <strong className="me-2">Tags:</strong>
          {post.tags.map(tag => (
            <span 
              key={tag.id} 
              className="badge bg-secondary me-1 p-2"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
      {/* Comments Section - ADD THIS */}
      <Comments />
      {/* Footer info */}
      <div className="mt-4 pt-3 border-top text-muted small">
        <p className="mb-0">📅 Created: {new Date(post.created_at).toLocaleDateString()}</p>
        {post.updated_at && post.updated_at !== post.created_at && (
          <p className="mb-0">🔄 Updated: {new Date(post.updated_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}

export default PostDetail;