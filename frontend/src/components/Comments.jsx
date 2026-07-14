import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Comments() {
  const { slug } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access_token');

  // Fetch comments for this post
  useEffect(() => {
    if (!slug) return;
    
    axios.get(`/api/comments/?post_slug=${slug}`)
      .then(response => {
        const commentsData = response.data.results || response.data || [];
        setComments(Array.isArray(commentsData) ? commentsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        setError('Could not load comments.');
        setComments([]);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if user is logged in
    if (!token) {
      alert('Please log in to leave a comment.');
      return;
    }

    if (!newComment.trim()) {
      alert('Please write a comment.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        '/api/comments/',
        {
          post_slug: slug,
          content: newComment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment('');
      setSubmitting(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      
      let errorMsg = 'Failed to post comment.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401) {
          errorMsg = 'You are not logged in. Please log in and try again.';
          // Redirect to login after a moment
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (error.response.data) {
          const errData = error.response.data;
          if (typeof errData === 'object') {
            const msgs = [];
            for (const [field, value] of Object.entries(errData)) {
              if (Array.isArray(value)) {
                msgs.push(`${field}: ${value.join(', ')}`);
              } else if (typeof value === 'string') {
                msgs.push(`${field}: ${value}`);
              }
            }
            if (msgs.length > 0) {
              errorMsg = msgs.join('\n');
            }
          } else if (typeof errData === 'string') {
            errorMsg = errData;
          }
        }
      } else if (error.request) {
        errorMsg = 'No response from server. Please check your connection.';
      } else {
        errorMsg = error.message || 'An unexpected error occurred.';
      }
      
      setError(errorMsg);
      alert(errorMsg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-4">
        <div className="text-muted">Loading comments...</div>
      </div>
    );
  }

  const commentsList = Array.isArray(comments) ? comments : [];

  return (
    <div className="mt-5">
      <h3 className="mb-3">Comments ({commentsList.length})</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="commentInput" className="form-label">
            {token ? 'Leave a comment' : 'Please log in to comment'}
          </label>
          <textarea
            id="commentInput"
            className="form-control"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={token ? "Write your comment here..." : "Log in to leave a comment"}
            disabled={!token || submitting}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!token || submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Posting...
            </>
          ) : 'Post Comment'}
        </button>
        {!token && (
          <a href="/login" className="btn btn-outline-secondary ms-2">
            Login
          </a>
        )}
      </form>

      {/* Comments List */}
      {commentsList.length === 0 && (
        <div className="text-muted">No comments yet. Be the first!</div>
      )}
      {commentsList.map(comment => (
        <div key={comment.id} className="border-bottom pb-3 mb-3">
          <div className="d-flex justify-content-between">
            <strong>{comment.author_name || 'Unknown'}</strong>
            <small className="text-muted">
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </small>
          </div>
          <p className="mb-0 mt-1">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Comments;