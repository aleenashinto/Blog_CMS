import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Wrapper to suppress findDOMNode warning
const ReactQuillWrapper = React.forwardRef((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

function PostForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!slug);
  const [errorMessage, setErrorMessage] = useState('');

  // Category and Tag states
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch categories and tags for dropdowns
  useEffect(() => {
    axios.get('/api/categories/')
      .then(response => {
        const data = response.data.results || response.data || [];
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));

    axios.get('/api/tags/')
      .then(response => {
        const data = response.data.results || response.data || [];
        setTags(data);
      })
      .catch(error => console.error('Error fetching tags:', error));
  }, []);

  // If editing, fetch existing post data
  useEffect(() => {
    if (slug) {
      axios.get(`/api/posts/${slug}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        const post = response.data;
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setStatus(post.status);
        if (post.category) {
          setSelectedCategory(post.category.id);
        }
        if (post.tags && post.tags.length > 0) {
          setSelectedTags(post.tags.map(tag => tag.id));
        }
        setFetching(false);
      })
      .catch(error => {
        console.error('Error fetching post:', error);
        navigate('/dashboard');
      });
    }
  }, [slug, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('status', status);
    
    // Send category and tags correctly
    if (selectedCategory) {
      formData.append('category_id', selectedCategory);
    }
    if (selectedTags && selectedTags.length > 0) {
      selectedTags.forEach(tagId => formData.append('tag_ids', tagId));
    }
    if (featuredImage) {
      formData.append('featured_image', featuredImage);
    }

    try {
      if (slug) {
        // EDIT: PUT request
        await axios.put(`/api/posts/${slug}/`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        // CREATE: POST request
        await axios.post('/api/posts/', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving post:', error);
      
      // Improved error handling - extract meaningful error messages
      let errorMsg = 'Failed to save post. ';
      if (error.response && error.response.data) {
        const errData = error.response.data;
        // Handle different error structures
        if (typeof errData === 'string') {
          errorMsg = errData;
        } else if (Array.isArray(errData)) {
          errorMsg = errData.join(', ');
        } else if (typeof errData === 'object') {
          const msgs = [];
          for (const [field, value] of Object.entries(errData)) {
            if (Array.isArray(value)) {
              msgs.push(`${field}: ${value.join(', ')}`);
            } else if (typeof value === 'string') {
              msgs.push(`${field}: ${value}`);
            } else {
              msgs.push(`${field}: ${JSON.stringify(value)}`);
            }
          }
          errorMsg = msgs.join('\n');
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      alert(errorMsg);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Loading post...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h1 className="h3 mb-0">{slug ? 'Edit Post' : 'Create New Post'}</h1>
        </div>
        <div className="card-body">
          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {errorMessage}
              <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Excerpt */}
            <div className="mb-3">
              <label className="form-label">Excerpt (Short summary)</label>
              <textarea
                className="form-control"
                rows="2"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div className="mb-3">
              <label className="form-label">Content *</label>
              <ReactQuillWrapper
                value={content}
                onChange={setContent}
                style={{ height: '300px', marginBottom: '50px' }}
                theme="snow"
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label className="form-label">Tags</label>
              <select
                className="form-select"
                multiple
                value={selectedTags.map(String)}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  const values = options.map(opt => parseInt(opt.value));
                  setSelectedTags(values);
                }}
                style={{ height: '100px' }}
              >
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
              <small className="text-muted">Hold Ctrl (or Cmd) to select multiple tags</small>
            </div>

            {/* Featured Image */}
            <div className="mb-3">
              <label className="form-label">Featured Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setFeaturedImage(e.target.files[0])}
              />
              {slug && <small className="text-muted">Leave empty to keep the current image.</small>}
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Buttons */}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : slug ? 'Update Post' : 'Create Post'}
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostForm;