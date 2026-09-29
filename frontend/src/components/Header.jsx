import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header id="mainHeader" className={scrolled ? 'scrolled' : ''}>
            <Link to="/" className="logo">
                <img src="/src/assets/vemu-logo.jpeg" alt="VEMU Logo" />
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

export default Header;
