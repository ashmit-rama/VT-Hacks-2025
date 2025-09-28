import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Search, ArrowLeft } from "lucide-react";
import SwipeableDiscovery from "../components/SwipeableDiscovery/SwipeableDiscovery";
import VoiceInput from "../components/VoiceInput/VoiceInput";
import { HousingOption, ExtractedEntity } from "../types";
import { useProximateStore } from "../store";
import "./DiscoverPage.css";

// Define the search results type
interface SearchResults {
  success: boolean;
  query: string;
  classification: {
    intent: string;
    housingType: string;
    confidence: number;
    extractedEntities: Array<{
      type: string;
      value: any;
      confidence: number;
    }>;
  };
  searchFilters: any;
  results: HousingOption[];
  totalResults: number;
  timestamp: string;
}

interface DiscoverPageProps {
  housingOptions: HousingOption[];
  onHousingSelect: (housing: HousingOption) => void;
  onLike: (housing: HousingOption) => void;
  onDislike: (housing: HousingOption) => void;
  onVoiceTranscript: (transcript: string, entities: ExtractedEntity[]) => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({
  housingOptions,
  onHousingSelect,
  onLike,
  onDislike,
  onVoiceTranscript,
}) => {
  const navigate = useNavigate();
  const [filteredHousing, setFilteredHousing] = useState(housingOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setSearchResults] = useState<SearchResults | null>(null);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { intelligentSearch } = useProximateStore();

  const handleSearchInput = async (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredHousing(housingOptions);
      setSearchResults(null);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      console.log("🔍 Starting search for:", query);
      // Use intelligent search for better results
      const results = await intelligentSearch(query, false);
      console.log("✅ Search results:", results);

      if (results && results.results && results.results.length > 0) {
        setSearchResults(results);
        console.log("🏠 First housing object:", results.results[0]);
        console.log("🏠 First housing ID:", results.results[0].id);
        console.log("🏠 First housing _id:", (results.results[0] as any)._id);
        setFilteredHousing(results.results);
        console.log(
          "📊 Set filtered housing to:",
          results.results.length,
          "results"
        );
      } else {
        console.log("⚠️ No results found, showing fallback");
        // Fallback to simple text-based filtering
        const filtered = housingOptions.filter(
          (housing) =>
            housing.title.toLowerCase().includes(query.toLowerCase()) ||
            housing.description.toLowerCase().includes(query.toLowerCase()) ||
            housing.address.toLowerCase().includes(query.toLowerCase()) ||
            housing.city.toLowerCase().includes(query.toLowerCase()) ||
            housing.state.toLowerCase().includes(query.toLowerCase()) ||
            housing.amenities.some((amenity) =>
              amenity.toLowerCase().includes(query.toLowerCase())
            )
        );
        setFilteredHousing(filtered);
        setSearchResults(null);
      }
    } catch (error) {
      console.error("❌ Error in intelligent search:", error);
      // Fallback to simple text-based filtering
      const filtered = housingOptions.filter(
        (housing) =>
          housing.title.toLowerCase().includes(query.toLowerCase()) ||
          housing.description.toLowerCase().includes(query.toLowerCase()) ||
          housing.address.toLowerCase().includes(query.toLowerCase()) ||
          housing.city.toLowerCase().includes(query.toLowerCase()) ||
          housing.state.toLowerCase().includes(query.toLowerCase()) ||
          housing.amenities.some((amenity) =>
            amenity.toLowerCase().includes(query.toLowerCase())
          )
      );
      setFilteredHousing(filtered);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
      // Show results with a smooth transition after a brief delay
      setTimeout(() => {
        setShowResults(true);
      }, 300);
    }
  };

  const handleVoiceSearchResults = (results: SearchResults) => {
    setSearchResults(results);
    setFilteredHousing(results.results || []);
    setShowVoiceInput(false);
    // Show results with transition
    setTimeout(() => {
      setShowResults(true);
    }, 300);
  };

  return (
    <div className="discover-page">
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
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="search-input"
                />
              </div>
              <button
                className="search-btn"
                onClick={() => {
                  if (searchQuery.trim()) {
                    handleSearchInput(searchQuery);
                  }
                }}
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
              <VoiceInput
                onTranscript={(transcript) => {
                  setSearchQuery(transcript);
                  handleSearchInput(transcript);
                }}
                onSearchResults={handleVoiceSearchResults}
              />
            </div>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching for the perfect match...</p>
        </div>
      )}

      {filteredHousing.length > 0 && showResults && (
        <div className="discover-content">
          <div className="swipeable-wrapper">
            <p className="swipe-instructions">
              ← Pass | ↓ My Favorites (Private) | → Saved Collection (Shared)
            </p>
          </div>

          <div className="swipeable-container">
            <SwipeableDiscovery
              housingOptions={filteredHousing}
              onLike={onLike}
              onDislike={onDislike}
              onSwipe={(action) => {
                console.log("Swipe action:", action);
              }}
            />
          </div>
        </div>
      )}

      {filteredHousing.length === 0 && searchQuery && showResults && (
        <div className="no-results">
          <div className="no-results-content">
            <h3>No housing options found</h3>
            <p>Try adjusting your search criteria</p>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery("");
                setFilteredHousing(housingOptions);
                setSearchResults(null);
              }}
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
