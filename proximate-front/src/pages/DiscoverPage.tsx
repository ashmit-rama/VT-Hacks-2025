import React, { useState } from "react";
import { Mic, Filter, MapPin } from "lucide-react";
import VoiceInput from "../components/VoiceInput/VoiceInput";
import SwipeableDiscovery from "../components/SwipeableDiscovery/SwipeableDiscovery";
import CampusSearch from "../components/CampusSearch/CampusSearch";
import { HousingOption, ExtractedEntity } from "../types";
import "./DiscoverPage.css";

interface DiscoverPageProps {
  housingOptions: HousingOption[];
  onHousingSelect: (housing: HousingOption) => void;
  onVoiceTranscript: (transcript: string, entities: ExtractedEntity[]) => void;
  onSearch: (filters: any) => void;
  onCampusChange: (campus: any) => void;
  onLike: (housing: HousingOption) => void;
  onDislike: (housing: HousingOption) => void;
  onSuperLike: (housing: HousingOption) => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({
  housingOptions,
  onHousingSelect,
  onVoiceTranscript,
  onSearch,
  onCampusChange,
  onLike,
  onDislike,
  onSuperLike,
}) => {
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHousing, setFilteredHousing] = useState(housingOptions);

  const handleVoiceTranscript = (
    transcript: string,
    entities: ExtractedEntity[]
  ) => {
    onVoiceTranscript(transcript, entities);
    setShowVoiceInput(false);

    // Apply filters based on extracted entities
    let filtered = [...housingOptions];

    entities.forEach((entity) => {
      switch (entity.type) {
        case "budget":
          filtered = filtered.filter(
            (housing) => housing.price <= (entity.value as number)
          );
          break;
        case "amenity":
          filtered = filtered.filter((housing) =>
            housing.amenities.some((amenity) =>
              amenity
                .toLowerCase()
                .includes((entity.value as string).toLowerCase())
            )
          );
          break;
        case "commute_mode":
          // In a real app, this would filter based on commute preferences
          break;
      }
    });

    setFilteredHousing(filtered);
  };

  const handleSearch = (filters: any) => {
    onSearch(filters);

    // Apply filters to housing options
    let filtered = [...housingOptions];

    if (filters.priceRange) {
      filtered = filtered.filter(
        (housing) =>
          housing.price >= filters.priceRange.min &&
          housing.price <= filters.priceRange.max
      );
    }

    if (filters.bedrooms && filters.bedrooms.length > 0) {
      filtered = filtered.filter((housing) =>
        filters.bedrooms.includes(housing.bedrooms)
      );
    }

    if (filters.bathrooms && filters.bathrooms.length > 0) {
      filtered = filtered.filter((housing) =>
        filters.bathrooms.includes(housing.bathrooms)
      );
    }

    if (filters.petFriendly) {
      filtered = filtered.filter((housing) =>
        housing.amenities.some((amenity) =>
          amenity.toLowerCase().includes("pet")
        )
      );
    }

    if (filters.furnished) {
      filtered = filtered.filter((housing) =>
        housing.amenities.includes("Furnished")
      );
    }

    if (filters.parking) {
      filtered = filtered.filter((housing) =>
        housing.amenities.includes("Parking")
      );
    }

    if (filters.laundry) {
      filtered = filtered.filter((housing) =>
        housing.amenities.includes("Laundry")
      );
    }

    if (filters.wifi) {
      filtered = filtered.filter((housing) =>
        housing.amenities.includes("WiFi")
      );
    }

    if (filters.distanceToCampus) {
      filtered = filtered.filter(
        (housing) => housing.distanceToCampus <= filters.distanceToCampus
      );
    }

    setFilteredHousing(filtered);
  };

  return (
    <div className="discover-page">
      <div className="discover-header">
        <div className="discover-title">
          <h1>Discover Housing</h1>
          <p>Find your perfect home near campus</p>
        </div>

        <div className="discover-actions">
          <button
            className="action-btn voice-btn"
            onClick={() => setShowVoiceInput(!showVoiceInput)}
          >
            <Mic size={20} />
            Voice Search
          </button>

          <button
            className="action-btn filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      {showVoiceInput && (
        <div className="voice-input-section">
          <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>
      )}

      {showFilters && (
        <div className="filters-section">
          <CampusSearch
            onSearch={handleSearch}
            onCampusChange={onCampusChange}
          />
        </div>
      )}

      <div className="discovery-section">
        <div className="discovery-header">
          <div className="results-info">
            <MapPin size={16} />
            <span>{filteredHousing.length} housing options found</span>
          </div>

          <div className="discovery-instructions">
            <p>Swipe right to like, left to pass, or up to super like</p>
          </div>
        </div>

        <div className="swipeable-container">
          <SwipeableDiscovery
            housingOptions={filteredHousing}
            onLike={onLike}
            onDislike={onDislike}
            onSuperLike={onSuperLike}
            onSwipe={(action) => {
              console.log("Swipe action:", action);
            }}
          />
        </div>
      </div>

      {filteredHousing.length === 0 && (
        <div className="no-results">
          <div className="no-results-content">
            <h3>No housing options found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setFilteredHousing(housingOptions);
                setShowFilters(false);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
