import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// ─── COMPONENTS ───
import Home from './components/Home';
import Blogs from './components/Blogs';
import BlogDetails from './components/BlogDetails';
import PostDetail from './components/PostDetail';
import PostList from './components/PostList';
import CategoryPosts from './components/CategoryPosts';
import SearchResults from './components/SearchResults';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PostForm from './components/PostForm';
import Profile from './components/Profile';
import Comments from './components/Comments';
import Sidebar from './components/Sidebar';

// ─── NAVBAR (custom NexusAI theme) ───
function NavBar() {
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <nav>
      <Link to="/" className="nav-logo">
        <div className="logo-mark">N∑</div>
        NexusAI
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/#services">Services</Link></li>
        <li><Link to="/#technology">Technology</Link></li>
        <li><Link to="/#process">Process</Link></li>
        <li><Link to="/#industries">Industries</Link></li>
        <li><Link to="/#about">About</Link></li>
        <li><Link to="/blogs" style={{ color: 'var(--cyan)' }}>Blogs</Link></li>
        {token && (
          <>
            <li><Link to="/dashboard" style={{ color: 'var(--cyan)' }}>Dashboard</Link></li>
            <li><Link to="/profile" style={{ color: 'var(--cyan)' }}>Profile</Link></li>
          </>
        )}
      </ul>
      {!token ? (
        <Link to="/login" className="nav-cta">Admin Login</Link>
      ) : (
        <button className="nav-cta" onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

// ─── MAIN APP ───
function App() {
  return (
    <Router>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/category/:slug" element={<CategoryPosts />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<PostForm />} />
          <Route path="/dashboard/edit/:slug" element={<PostForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={
            <div className="container mt-5 text-center">
              <h1 className="display-1">404</h1>
              <h2>Page Not Found</h2>
              <p className="text-muted">The page you're looking for doesn't exist.</p>
              <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
          } />
        </Routes>
      </main>
      <footer className="bg-dark text-white-50 text-center py-3 mt-5 border-top border-secondary">
        <div className="container">
          <small>© {new Date().getFullYear()} My Blog CMS. Built with Django + React.</small>
        </div>
      </footer>
    </Router>
  );
}

export default App;