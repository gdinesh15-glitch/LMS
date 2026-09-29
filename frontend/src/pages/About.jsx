import React from 'react';
import { Link } from 'react-router-dom';
import '../about.css'; // This will contain about specific styles

const About = () => {
  return (
    <>
      {/* MAIN CONTENT */}
      <main>
          <div className="container">
              {/* PAGE HEADER */}
              <section style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <h1 style={{ color: '#667eea', fontSize: '40px', marginBottom: '10px' }}>About Us</h1>
                  <p style={{ color: '#666', fontSize: '18px' }}>Learn more about VEMU Institute and our Library Management System</p>
              </section>

              {/* ABOUT SECTION */}
              <section className="about-section">
                  <h2>About VEMU Institute of Technology</h2>
                  <p>
                      VEMU Institute of Technology is one of the premier educational institutions dedicated to providing quality higher education in engineering and technology. Our institution is committed to fostering academic excellence and innovation among students.
                  </p>
                  <p>
                      Founded with a vision to create world-class engineers and technologists, VEMU has established itself as a leader in technical education. The Library Management System has been developed to streamline and enhance the library operations, making it easier
                      for students, faculty, and administrators to manage library resources efficiently.
                  </p>
              </section>

              {/* LIBRARY INFORMATION */}
              <section className="about-section">
                  <h2>About Our Library</h2>
                  <p>
                      The VEMU Library is a hub of knowledge and learning, housing a vast collection of books, journals, and digital resources. Our library serves all students, faculty, and staff members of the institution with a commitment to excellence and accessibility.
                  </p>
                  <h3>Library Features:</h3>
                  <ul>
                      <li>📚 Over 50,000+ Books in diverse subjects</li>
                      <li>💻 Digital and Online Resources</li>
                      <li>🖥️ Computer Lab for Research</li>
                      <li>👥 Expert Library Staff</li>
                      <li>⏰ Extended Working Hours (7 AM - 10 PM)</li>
                      <li>🎓 Student Friendly Environment</li>
                      <li>📖 Rare and Reference Books Section</li>
                      <li>🔍 Advanced Search Capabilities</li>
                  </ul>
              </section>

              {/* SYSTEM BENEFITS */}
              <section className="about-section">
                  <h2>Benefits of Our Library Management System</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
                      <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                          <h4 style={{ color: '#667eea', marginBottom: '10px' }}>⚡ Fast Processing</h4>
                          <p>Quick and easy book issue and return process, saving time for both students and librarians.</p>
                      </div>
                      <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #764ba2' }}>
                          <h4 style={{ color: '#764ba2', marginBottom: '10px' }}>📊 Better Tracking</h4>
                          <p>Real-time tracking of book availability and borrowing history for informed decisions.</p>
                      </div>
                      <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                          <h4 style={{ color: '#667eea', marginBottom: '10px' }}>🔒 Secure System</h4>
                          <p>Encrypted login system ensures that student and book data are always secure and protected.</p>
                      </div>
                      <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #764ba2' }}>
                          <h4 style={{ color: '#764ba2', marginBottom: '10px' }}>👥 Easy Access</h4>
                          <p>Role-based access control ensures that each user sees only relevant information.</p>
                      </div>
                      <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                          <h4 style={{ color: '#667eea', marginBottom: '10px' }}>📈 Better Management</h4>
                          <p>Administrators can easily manage books, track circulation, and generate reports.</p>
                      </div>
                      <div style={{ background: '#f8f9ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #764ba2' }}>
                          <h4 style={{ color: '#764ba2', marginBottom: '10px' }}>🎓 Student Support</h4>
                          <p>Students can easily find books, check availability, and manage their borrowing records.</p>
                      </div>
                  </div>
              </section>

              {/* MISSION & VISION */}
              <section className="about-section" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)' }}>
                  <h2>Our Mission & Vision</h2>
                  <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
                      <div style={{ flex: '1', minWidth: '250px' }}>
                          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>🎯 Our Mission</h3>
                          <p>To provide a seamless, user-friendly library management experience that empowers students, faculty, and staff to access and manage library resources efficiently and effectively.</p>
                      </div>
                      <div style={{ flex: '1', minWidth: '250px' }}>
                          <h3 style={{ color: '#764ba2', marginBottom: '15px' }}>👁️ Our Vision</h3>
                          <p>To establish a digital-first library ecosystem that promotes knowledge sharing, encourages learning, and supports academic excellence at VEMU Institute of Technology.</p>
                      </div>
                  </div>
              </section>

              {/* CONTACT CTA */}
              <section className="about-section" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <h2 style={{ color: 'white' }}>Have Questions?</h2>
                  <p style={{ color: '#f0f4ff' }}>For more information about the library or this management system, please contact us.</p>
                  <Link to="/contact" className="btn btn-large">Contact Us</Link>
              </section>
          </div>
      </main>

      {/* FOOTER */}
      <footer>
          <p className="footer-text">&copy; 2024 VEMU INSTITUTE OF TECHNOLOGY Library Management System</p>
          <p className="footer-text">All Rights Reserved | Developed for Educational Purpose</p>
          <p><Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/contact">Contact</Link></p>
      </footer>
    </>
  );
};

export default About;
