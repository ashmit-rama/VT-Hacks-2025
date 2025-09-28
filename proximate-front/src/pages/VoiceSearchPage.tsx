import React from "react";
import { Link } from "react-router-dom";
import { Mic, Search, ArrowLeft } from "lucide-react";
import "./VoiceSearchPage.css";

const VoiceSearchPage: React.FC = () => {
  return (
    <div className="voice-search-page">
      <div className="voice-search-container">
        <div className="back-button">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        <div className="voice-search-content">
          <h1>How would you like to search?</h1>
          <p className="voice-search-subtitle">
            Choose your preferred way to find your perfect home
          </p>

          <div className="search-options">
            <Link to="/discover" className="search-option voice-option">
              <div className="option-icon">
                <Mic size={48} />
              </div>
              <h3>Voice Note</h3>
              <p>Speak your preferences and let AI find the perfect match</p>
            </Link>

            <Link to="/discover" className="search-option search-bar-option">
              <div className="option-icon">
                <Search size={48} />
              </div>
              <h3>Search Bar</h3>
              <p>
                Use filters and search to find exactly what you're looking for
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearchPage;
