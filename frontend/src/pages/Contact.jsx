import React from 'react';
import { Link } from 'react-router-dom';
import '../contact.css'; // This will contain contact specific styles

const Contact = () => {
  return (
    <>
      {/* MAIN CONTENT */}
      <main>
          <div className="container">
              {/* PAGE TITLE */}
              <section style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <h1 style={{ color: '#667eea', fontSize: '40px', marginBottom: '10px' }}>Contact Us</h1>
                  <p style={{ color: '#666', fontSize: '18px' }}>We're here to help! Get in touch with us for any inquiries.</p>
              </section>

              {/* CONTACT INFORMATION */}
              <section className="about-section">
                  <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Library Contact Information</h2>
                  <div className="contact-info">
                      <div className="contact-item">
                          <h4>📍 Location</h4>
                          <p>
                              VEMU Institute of Technology<br/> Chittoor District<br/> Andhra Pradesh - 517112<br/> India
                          </p>
                      </div>

                      <div className="contact-item">
                          <h4>📞 Phone</h4>
                          <p>
                              Main Office: +91-8571-XXXX-XX<br/> Library Desk: +91-8571-XXXX-XX<br/> Support: +91-8571-XXXX-XX<br/> Emergency: +91-XXXX-XXX-XXX
                          </p>
                      </div>

                      <div className="contact-item">
                          <h4>✉️ Email</h4>
                          <p>
                              Library: <a href="mailto:library@vemu.edu.in" style={{ color: '#667eea' }}>library@vemu.edu.in</a><br/> Support: <a href="mailto:support@vemu.edu.in" style={{ color: '#667eea' }}>support@vemu.edu.in</a><br/> Admin: <a href="mailto:admin@vemu.edu.in" style={{ color: '#667eea' }}>admin@vemu.edu.in</a><br/> Feedback: <a href="mailto:feedback@vemu.edu.in" style={{ color: '#667eea' }}>feedback@vemu.edu.in</a>
                          </p>
                      </div>

                      <div className="contact-item">
                          <h4>⏰ Working Hours</h4>
                          <p>
                              Monday - Friday: 7:00 AM - 10:00 PM<br/> Saturday: 9:00 AM - 8:00 PM<br/> Sunday: Closed<br/> Holidays: Closed
                          </p>
                      </div>
                  </div>
              </section>

              {/* FREQUENTLY ASKED QUESTIONS */}
              <section className="about-section">
                  <h2>Frequently Asked Questions (FAQ)</h2>

                  <div style={{ marginTop: '30px' }}>
                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: How long can I borrow a book?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: Students can borrow books for 15 days. Faculty members can borrow for 30 days. Extensions are possible subject to availability.</p>

                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: What are the late fees?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: Late fees are Rs. 5 per book per day. Maximum late fee cannot exceed Rs. 50 per book. Fees must be paid at the library counter.</p>

                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: How do I reset my password?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: Contact the library staff with your student/employee ID to reset your password. It can be done on-site at the library desk or via email at support@vemu.edu.in</p>

                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: Can I reserve a book?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: Yes, you can reserve books through the system. Reserved books are held for 3 days before being made available to others. You'll be notified via email.</p>

                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: What if a book is damaged or lost?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: Report damaged or lost books to the library staff immediately. You may be charged for damage or loss based on the book's value and condition.</p>

                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: How do I use the Library Management System?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: Visit the login page, select your role (Student, Faculty, Admin, or Librarian), and login with your credentials. Each role has specific functionalities explained in the dashboard.</p>

                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: Can I access the library from outside the campus?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: Yes, the Library Management System can be accessed 24/7 from anywhere with internet connectivity using your login credentials.</p>

                      <h4 style={{ color: '#667eea', margin: '20px 0 10px 0' }}>Q: What books are available in the library?</h4>
                      <p style={{ marginLeft: '20px', marginBottom: '20px' }}>A: You can search for books using the Library Management System. We have books on Engineering, Science, Mathematics, Literature, History, and many other subjects.</p>
                  </div>
              </section>

              {/* MESSAGE FROM MANAGEMENT */}
              <section className="about-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginTop: '40px' }}>
                  <h2 style={{ color: 'white' }}>📩 Message from Library Management</h2>
                  <p style={{ color: '#e8e8e8' }}>
                      The VEMU Library is committed to providing excellent service to all students, faculty, and staff. We continuously strive to improve our collection and services to meet the evolving needs of our academic community. If you have any suggestions or feedback
                      regarding the library or this management system, please don't hesitate to contact us. Your feedback helps us serve you better. Thank you for being part of the VEMU family!
                  </p>
              </section>

              {/* QUICK LINKS */}
              <section className="form-section">
                  <h3>🔗 Quick Links</h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <Link to="/" className="btn">Home</Link>
                      <Link to="/about" className="btn">About</Link>
                      <Link to="/login" className="btn">Login</Link>
                  </div>
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

export default Contact;
