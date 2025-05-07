import React from 'react';
        import { Link } from "react-router-dom";
        import { ArrowRight, BookOpen, Users, Award, Instagram, Twitter, Linkedin, Lightbulb, Home, GraduationCap, Building2, Puzzle, Rocket } from "lucide-react";
        import './FrontPage.css';
        import logo from "./assets/logo.png"
       

        export default function FrontPage() {
          return (
            <div className="front-page-container">
              <nav className="navbar">
                <div className="navbar-content">
                  <div className="navbar-brand">
                    <Link to="/" className="brand-link">
                    <img src={logo} alt="logo" className='logo-img' />
                    </Link>
                  </div>
                  <div className="navbar-menu">
                    {["Home", "Upload", "Blog", "Contact Us"].map((item) => (
                      <Link
                        key={item}
                        to={`/${item.toLowerCase().replace(" ", "-")}`}
                        className="menu-link"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              <main className="main-content">
                <div className="hero-section">
                  <h1 className="hero-title">
                    D.Y. Patil College of Engineering, Akurdi
                  </h1>
                  <p className="hero-subtitle">Department of Computer Engineering</p>
                  <Link
                    to="/tree"
                    className="hero-button"
                  >
                    Automated Attainment Calculator
                  </Link>
                </div>

                <div className="features-section">
                  <div className="feature-card small-card">
                    <Lightbulb className="feature-icon" />
                    <h2 className="feature-title">About Us</h2>
                    <p className="feature-description">Dedicated to providing quality education and fostering innovation.</p>
                  </div>
                   <div className="feature-card small-card">
                    <GraduationCap className="feature-icon" />
                    <h2 className="feature-title">Our Vision</h2>
                    <p className="feature-description">To be a leading institution in engineering education and research.</p>
                  </div>
                  <div className="feature-card">
                    <Building2 className="feature-icon" />
                    <h2 className="feature-title">Facilities</h2>
                    <p className="feature-description">Modern labs, libraries, and resources to support academic excellence.</p>
                  </div>
                  <div className="feature-card">
                    <Puzzle className="feature-icon" />
                    <h2 className="feature-title">Research & Innovation</h2>
                    <p className="feature-description">Encouraging students to participate in cutting-edge research and innovative projects.</p>
                  </div>
                  <div className="feature-card">
                    <Rocket className="feature-icon" />
                    <h2 className="feature-title">Career Development</h2>
                    <p className="feature-description">Preparing students for successful careers with industry-relevant skills.</p>
                  </div>
                </div>
              </main>

              <footer className="footer">
                <div className="footer-content">
                  <div className="footer-contact">
                    <h3 className="footer-heading">Contact Us</h3>
                     <p className="footer-text">Sector 29, Nigdi Pradhikaran, Pimpri-Chinchwad, near Akurdi Railway Station, Shivala Colony, Gurudwara Colony, Nigdi, Pune, Pimpri-Chinchwad, Maharashtra 411044, India</p>
                    <p className="footer-text">Phone: +91 1234567890</p>
                    <p className="footer-text">Email: info@dyp.edu</p>
                  </div>
                  <div className="footer-links">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-list">
                      <li><Link to="/admissions" className="footer-link">Admissions</Link></li>
                      <li><Link to="/departments" className="footer-link">Departments</Link></li>
                      <li><Link to="/research" className="footer-link">Research</Link></li>
                      <li><Link to="/careers" className="footer-link">Careers</Link></li>
                    </ul>
                  </div>
                  <div className="footer-social">
                    <h3 className="footer-heading">Follow Us</h3>
                    <div className="social-icons">
                      <Link to="/instagram" className="social-icon">
                        <span className="sr-only"></span>
                        <Instagram className="icon" />
                      </Link>
                      <Link to="/twitter" className="social-icon">
                
                        <span className="sr-only"></span>
                        <Twitter className="icon" />
                      </Link>
                      <Link to="/linkedin" className="social-icon">
                        <span className="sr-only"></span>
                        <Linkedin className="icon" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="footer-copyright">
                  <p className="copyright-text">
                    © 2022 D. Y. Patil College of Engineering, Akurdi. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          );
        }
