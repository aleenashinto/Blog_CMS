import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${slug}/`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found or failed to load.');
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading post…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger">
          <h4>⚠️ Error</h4>
          <p>{error || 'Post not found'}</p>
          <Link to="/blogs" className="btn btn-primary">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <Link to="/blogs" className="btn btn-outline-secondary mb-4">
            <i className="fas fa-arrow-left me-1"></i> Back to Blogs
          </Link>

          <article>
            {/* Featured Image */}
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="img-fluid rounded mb-4"
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
              />
            )}

            <h1 className="display-5 fw-bold mb-3">{post.title}</h1>

            {/* Meta info */}
            <div className="text-muted mb-4">
              <span>
                <i className="fas fa-user me-1"></i>
                {post.author_name || 'Anonymous'}
              </span>
              <span className="ms-3">
                <i className="fas fa-calendar-alt me-1"></i>
                {formatDate(post.published_at || post.created_at)}
              </span>
              {post.category && (
                <span className="ms-3">
                  <i className="fas fa-tag me-1"></i>
                  {post.category.name}
                </span>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="badge bg-secondary me-1">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div
              className="fs-5 lh-lg"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            <hr className="my-5" />

            <Link to="/blogs" className="btn btn-outline-primary">
              <i className="fas fa-arrow-left me-1"></i> More Posts
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;