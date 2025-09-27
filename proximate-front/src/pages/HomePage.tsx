import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, Heart, Users, Mic, MapPin, Shield } from "lucide-react";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Home Near Campus</h1>
          <p className="hero-subtitle">
            AI-driven housing discovery that matches your lifestyle, commute
            preferences, and daily routines in Blacksburg and beyond.
          </p>
          <div className="hero-actions">
            <Link to="/discover" className="cta-button primary">
              <Search size={20} />
              Start Discovering
            </Link>
            <Link to="/collections" className="cta-button secondary">
              <Heart size={20} />
              View Collections
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <Home size={120} color="#61dafb" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2>Why Choose Proximate?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Mic size={32} color="#61dafb" />
              </div>
              <h3>Voice & Translation</h3>
              <p>
                Speak your preferences in any language. Our AI extracts commute
                modes, budget, amenities, and lifestyle needs automatically.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Search size={32} color="#4caf50" />
              </div>
              <h3>Smart Discovery</h3>
              <p>
                Swipe through housing options like Tinder. Our algorithm learns
                your preferences and shows you the best matches first.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} color="#ff9800" />
              </div>
              <h3>Community Insights</h3>
              <p>
                Read verified reviews from past tenants. See community tags and
                get real insights from people who've lived there.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MapPin size={32} color="#9c27b0" />
              </div>
              <h3>Campus-Focused</h3>
              <p>
                Search across Virginia Tech campuses with smart filters. Find
                housing that fits your academic schedule and lifestyle.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} color="#f44336" />
              </div>
              <h3>Secure & Private</h3>
              <p>
                Your data is protected with enterprise-grade security. Anonymous
                options available for sensitive preferences.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Heart size={32} color="#e91e63" />
              </div>
              <h3>Share with Roommates</h3>
              <p>
                Create collections and share them with potential roommates.
                Collaborate on decisions and find your perfect living situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Tell Us About Yourself</h3>
                <p>
                  Speak or type your preferences - commute style, budget,
                  lifestyle needs, and more.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Discover Housing</h3>
                <p>
                  Swipe through personalized housing recommendations based on
                  your preferences.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Community Insights</h3>
                <p>
                  Read reviews from past tenants and see community tags from
                  current residents.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Share & Decide</h3>
                <p>
                  Create collections, share with roommates, and make informed
                  decisions together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Find Your Perfect Home?</h2>
          <p>
            Join thousands of students who've found their ideal housing with
            Proximate.
          </p>
          <Link to="/discover" className="cta-button primary large">
            <Search size={24} />
            Start Your Search
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
