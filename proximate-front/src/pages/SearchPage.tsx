import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Search, ArrowLeft } from "lucide-react";
import VoiceInput from "../components/VoiceInput/VoiceInput";
import { ExtractedEntity } from "../types";
import "./SearchPage.css";

interface SearchPageProps {
  onVoiceTranscript: (transcript: string, entities: ExtractedEntity[]) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onVoiceTranscript }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to discover page with search query
      navigate(`/discover?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleVoiceTranscript = (
    transcript: string,
    entities: ExtractedEntity[]
  ) => {
    onVoiceTranscript(transcript, entities);
    setShowVoiceInput(false);
    // Set the transcript as search query and navigate to discover page
    setSearchQuery(transcript);
    navigate("/discover");
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="back-button">
          <button onClick={() => navigate("/")} className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>

        <div className="search-content">
          <h1>Find Your Perfect Home</h1>
          <p className="search-subtitle">
            Search for housing or use voice to describe what you're looking for
          </p>

          <div className="search-interface">
            <div className="search-bar-container">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for housing, location, amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="search-input"
                />
              </div>
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                Search
              </button>
            </div>

            <div className="voice-section">
              <button
                className="voice-btn"
                onClick={() => setShowVoiceInput(!showVoiceInput)}
              >
                <Mic size={24} />
                Voice Search
              </button>
              <p className="voice-description">
                Speak your preferences and let AI find the perfect match
              </p>
            </div>
          </div>

          {showVoiceInput && (
            <div className="voice-input-section">
              <VoiceInput onTranscript={handleVoiceTranscript} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
