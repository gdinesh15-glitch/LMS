import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../pages/Home.css'; // This contains the header styles from index.css

const Navbar = () => {
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('mainHeader');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 60);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="mainHeader">
      <Link to="/" className="logo">
        <img src="/src/assets/vemu-logo.jpg" alt="VEMU Logo" />
        <span>VEMU LIBRARY</span>
      </Link>
      <nav>
        <Link to="/"><i className="fas fa-home"></i> Home</Link>
        <Link to="/about"><i className="fas fa-info-circle"></i> About</Link>
        <Link to="/contact"><i className="fas fa-envelope"></i> Contact</Link>
        <Link to="/login" className="login-btn"><i className="fas fa-sign-in-alt"></i> Login</Link>
      </nav>
    </header>
  );
};

export default Navbar;
