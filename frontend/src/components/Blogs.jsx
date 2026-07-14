import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Blogs() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts/');
        // Handle paginated response (Django REST Framework)
        const postsData = response.data.results || response.data || [];
        setPosts(postsData);
        setFilteredPosts(postsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts. Please try again.');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Extract unique categories and tags from all posts
  const categories = [
    'All',
    ...new Set(
      posts
        .map(post => post.category?.name)
        .filter(Boolean)
    ),
  ];

  const tags = [
    'All',
    ...new Set(
      posts
        .flatMap(post => post.tags?.map(tag => tag.name) || [])
        .filter(Boolean)
    ),
  ];

  // Apply filters whenever search, category, or tag changes
  useEffect(() => {
    let result = posts;

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(term) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
          (post.content && post.content.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category?.name === selectedCategory);
    }

    // Tag filter
    if (selectedTag !== 'All') {
      result = result.filter(post =>
        post.tags?.some(tag => tag.name === selectedTag)
      );
    }

    setFilteredPosts(result);
  }, [posts, searchTerm, selectedCategory, selectedTag]);

  // Helper: get author name
  const getAuthorName = (post) => {
    if (post.author_name) return post.author_name;
    if (post.author) {
      if (typeof post.author === 'string') return post.author;
      if (typeof post.author === 'object') {
        return post.author.username || post.author.first_name || 'Anonymous';
      }
    }
    return 'Anonymous';
  };

  // Helper: get formatted date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return '';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Helper: get image URL
  const getImageUrl = (post) => {
    return post.featured_image || post.image || null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading blog posts…</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Error</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Please check your internet connection or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="display-5 fw-bold mb-4">📝 Blog</h1>
          <p className="lead text-muted">
            Explore our latest articles on technology, AI, and software engineering.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="row mt-4 mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="card bg-light shadow-sm">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                {/* Search */}
                <div className="col-md-4">
                  <label htmlFor="searchInput" className="form-label fw-semibold">
                    Search
                  </label>
                  <input
                    type="text"
                    id="searchInput"
                    className="form-control"
                    placeholder="Search posts…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category filter */}
                <div className="col-md-4">
                  <label htmlFor="categorySelect" className="form-label fw-semibold">
                    Category
                  </label>
                  <select
                    id="categorySelect"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag filter */}
                <div className="col-md-4">
                  <label htmlFor="tagSelect" className="form-label fw-semibold">
                    Tag
                  </label>
                  <select
                    id="tagSelect"
                    className="form-select"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Cards */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="lead text-muted">No posts found matching your filters.</p>
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedTag('All');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const authorName = getAuthorName(post);
              const formattedDate = formatDate(post.published_at || post.created_at);
              const imageUrl = getImageUrl(post);
              const postLink = `/post/${post.slug}`;

              return (
                <div key={post.id} className="card mb-4 shadow-sm">
                  {/* Clickable card area */}
                  <Link
                    to={postLink}
                    className="text-decoration-none text-reset"
                  >
                    <div className="row g-0">
                      {/* Image column */}
                      {imageUrl && (
                        <div className="col-md-4">
                          <img
                            src={imageUrl}
                            className="img-fluid rounded-start h-100 w-100 object-fit-cover"
                            alt={post.title}
                            style={{ minHeight: '200px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className={imageUrl ? 'col-md-8' : 'col-12'}>
                        <div className="card-body">
                          {/* Category badge */}
                          {post.category && (
                            <span className="badge bg-primary mb-2">
                              {post.category.name}
                            </span>
                          )}

                          <h5 className="card-title">{post.title}</h5>

                          <p className="card-text text-muted">
                            {post.excerpt ||
                              (post.content
                                ? post.content.replace(/<[^>]+>/g, '').slice(0, 120) + '…'
                                : '')}
                          </p>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="mb-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="badge bg-secondary me-1"
                                >
                                  #{tag.name}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="small text-muted">
                              <span>
                                <i className="fas fa-user me-1"></i>
                                {authorName}
                              </span>
                              {formattedDate && (
                                <span className="ms-3">
                                  <i className="fas fa-calendar-alt me-1"></i>
                                  {formattedDate}
                                </span>
                              )}
                            </div>
                            <span className="text-primary">
                              Read More <i className="fas fa-arrow-right"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;