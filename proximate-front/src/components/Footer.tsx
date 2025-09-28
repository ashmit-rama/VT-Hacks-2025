import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Proximate</h3>
            <p className="footer-description">
              AI-driven housing discovery that matches your lifestyle, commute
              preferences, and daily routines in Blacksburg and beyond.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">
                Home
              </Link>
              <Link to="/discover" className="footer-link">
                Discover
              </Link>
              <Link to="/collections" className="footer-link">
                Collections
              </Link>
              <Link to="/profile" className="footer-link">
                Profile
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Support</h4>
            <div className="footer-links">
              <a href="#help" className="footer-link">
                Help Center
              </a>
              <a href="#contact" className="footer-link">
                Contact Us
              </a>
              <a href="#faq" className="footer-link">
                FAQ
              </a>
              <a href="#feedback" className="footer-link">
                Feedback
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@proximate.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (540) 555-0123</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Blacksburg, VA 24060</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Proximate. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy" className="footer-link">
              Privacy Policy
            </a>
            <a href="#terms" className="footer-link">
              Terms of Service
            </a>
            <a href="#cookies" className="footer-link">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
