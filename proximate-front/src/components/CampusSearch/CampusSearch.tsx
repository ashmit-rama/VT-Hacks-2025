import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  X,
  Save,
  Clock,
  DollarSign,
} from "lucide-react";
import { Campus, SearchFilters } from "../../types";
import { useProximateStore } from "../../store";
import "./CampusSearch.css";

interface CampusSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  onCampusChange?: (campus: Campus) => void;
}

const CampusSearch: React.FC<CampusSearchProps> = ({
  onSearch,
  onCampusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SearchFilters[]>([]);

  const { searchFilters, setSearchFilters, updateSearchFilter } =
    useProximateStore();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const campuses: Campus[] = [
    {
      id: "blacksburg",
      name: "Virginia Tech - Blacksburg",
      city: "Blacksburg",
      state: "VA",
      coordinates: { lat: 37.2296, lng: -80.4139 },
      radius: 10,
    },
    {
      id: "roanoke",
      name: "Virginia Tech - Roanoke",
      city: "Roanoke",
      state: "VA",
      coordinates: { lat: 37.271, lng: -79.9414 },
      radius: 8,
    },
    {
      id: "arlington",
      name: "Virginia Tech - Arlington",
      city: "Arlington",
      state: "VA",
      coordinates: { lat: 38.8816, lng: -77.091 },
      radius: 15,
    },
    {
      id: "richmond",
      name: "Virginia Tech - Richmond",
      city: "Richmond",
      state: "VA",
      coordinates: { lat: 37.5407, lng: -77.436 },
      radius: 12,
    },
  ];

  const amenityOptions = [
    "Parking",
    "Laundry",
    "WiFi",
    "Furnished",
    "Pet Friendly",
    "Gym",
    "Pool",
    "Balcony",
    "Dishwasher",
    "Air Conditioning",
    "Heating",
    "Storage",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);

    if (value.length > 2) {
      // Mock search suggestions - in real app, this would call your search API
      const mockSuggestions = [
        "Apartments near Virginia Tech",
        "Houses in downtown Blacksburg",
        "Student housing with parking",
        "Pet-friendly apartments",
        "Furnished rooms near campus",
        "Budget housing under $800",
        "Quiet neighborhood housing",
        "Housing with laundry facilities",
      ].filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);

    // Extract filters from suggestion
    const filters = { ...searchFilters };

    if (suggestion.includes("parking")) {
      filters.parking = true;
    }
    if (suggestion.includes("pet")) {
      filters.petFriendly = true;
    }
    if (suggestion.includes("furnished")) {
      filters.furnished = true;
    }
    if (suggestion.includes("laundry")) {
      filters.laundry = true;
    }
    if (suggestion.includes("under $800")) {
      filters.priceRange.max = 800;
    }

    setSearchFilters(filters);
    if (onSearch) onSearch(filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    updateSearchFilter(key, value);
  };

  const handleCampusChange = (campusId: string) => {
    const campus = campuses.find((c) => c.id === campusId);
    if (campus) {
      updateSearchFilter("campus", campusId);
      if (onCampusChange) onCampusChange(campus);
    }
  };

  const handleSearch = () => {
    if (onSearch) onSearch(searchFilters);
  };

  const saveCurrentFilters = () => {
    const filterName = prompt("Enter a name for these filters:");
    if (filterName) {
      const newSavedFilter = { ...searchFilters, name: filterName };
      setSavedFilters((prev) => [...prev, newSavedFilter]);
    }
  };

  const loadSavedFilters = (savedFilter: SearchFilters) => {
    setSearchFilters(savedFilter);
    if (onSearch) onSearch(savedFilter);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      campus: "blacksburg",
      priceRange: { min: 0, max: 2000 },
      bedrooms: [],
      bathrooms: [],
      amenities: [],
      distanceToCampus: 5,
      petFriendly: false,
      furnished: false,
      parking: false,
      laundry: false,
      wifi: false,
      moveInDate: new Date(),
      leaseLength: 12,
    };
    setSearchFilters(defaultFilters);
  };

  const currentCampus = campuses.find((c) => c.id === searchFilters.campus);

  return (
    <div className="campus-search">
      <div className="search-header">
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search for housing, neighborhoods, or amenities..."
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search size={14} />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="campus-selector">
        <div className="campus-info">
          <MapPin size={16} />
          <span className="campus-name">{currentCampus?.name}</span>
          <span className="campus-location">
            {currentCampus?.city}, {currentCampus?.state}
          </span>
        </div>

        <select
          value={searchFilters.campus}
          onChange={(e) => handleCampusChange(e.target.value)}
          className="campus-select"
        >
          {campuses.map((campus) => (
            <option key={campus.id} value={campus.id}>
              {campus.name}
            </option>
          ))}
        </select>
      </div>

      <div className="quick-filters">
        <div className="quick-filter-group">
          <label>
            <input
              type="checkbox"
              checked={searchFilters.petFriendly}
              onChange={(e) =>
                handleFilterChange("petFriendly", e.target.checked)
              }
            />
            Pet Friendly
          </label>

          <label>
            <input
              type="checkbox"
              checked={searchFilters.furnished}
              onChange={(e) =>
                handleFilterChange("furnished", e.target.checked)
              }
            />
            Furnished
          </label>

          <label>
            <input
              type="checkbox"
              checked={searchFilters.parking}
              onChange={(e) => handleFilterChange("parking", e.target.checked)}
            />
            Parking
          </label>

          <label>
            <input
              type="checkbox"
              checked={searchFilters.laundry}
              onChange={(e) => handleFilterChange("laundry", e.target.checked)}
            />
            Laundry
          </label>
        </div>

        <button
          className="filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Advanced Filters
        </button>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <div className="price-input">
                  <DollarSign size={16} />
                  <input
                    type="number"
                    value={searchFilters.priceRange.min}
                    onChange={(e) =>
                      handleFilterChange("priceRange", {
                        ...searchFilters.priceRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Min"
                  />
                </div>
                <span>to</span>
                <div className="price-input">
                  <DollarSign size={16} />
                  <input
                    type="number"
                    value={searchFilters.priceRange.max}
                    onChange={(e) =>
                      handleFilterChange("priceRange", {
                        ...searchFilters.priceRange,
                        max: parseInt(e.target.value) || 2000,
                      })
                    }
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label>Bedrooms</label>
              <div className="checkbox-group">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num}>
                    <input
                      type="checkbox"
                      checked={searchFilters.bedrooms.includes(num)}
                      onChange={(e) => {
                        const bedrooms = e.target.checked
                          ? [...searchFilters.bedrooms, num]
                          : searchFilters.bedrooms.filter((b) => b !== num);
                        handleFilterChange("bedrooms", bedrooms);
                      }}
                    />
                    {num}+
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Bathrooms</label>
              <div className="checkbox-group">
                {[1, 1.5, 2, 2.5, 3].map((num) => (
                  <label key={num}>
                    <input
                      type="checkbox"
                      checked={searchFilters.bathrooms.includes(num)}
                      onChange={(e) => {
                        const bathrooms = e.target.checked
                          ? [...searchFilters.bathrooms, num]
                          : searchFilters.bathrooms.filter((b) => b !== num);
                        handleFilterChange("bathrooms", bathrooms);
                      }}
                    />
                    {num}+
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Distance to Campus</label>
              <div className="distance-slider">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={searchFilters.distanceToCampus}
                  onChange={(e) =>
                    handleFilterChange(
                      "distanceToCampus",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <span>{searchFilters.distanceToCampus} miles</span>
              </div>
            </div>

            <div className="filter-group">
              <label>Amenities</label>
              <div className="amenities-grid">
                {amenityOptions.map((amenity) => (
                  <label key={amenity}>
                    <input
                      type="checkbox"
                      checked={searchFilters.amenities.includes(amenity)}
                      onChange={(e) => {
                        const amenities = e.target.checked
                          ? [...searchFilters.amenities, amenity]
                          : searchFilters.amenities.filter(
                              (a) => a !== amenity
                            );
                        handleFilterChange("amenities", amenities);
                      }}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Move-in Date</label>
              <input
                type="date"
                value={searchFilters.moveInDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  handleFilterChange("moveInDate", new Date(e.target.value))
                }
              />
            </div>

            <div className="filter-group">
              <label>Lease Length</label>
              <select
                value={searchFilters.leaseLength}
                onChange={(e) =>
                  handleFilterChange("leaseLength", parseInt(e.target.value))
                }
              >
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
                <option value={18}>18 months</option>
                <option value={24}>24 months</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
            <button className="save-filters-btn" onClick={saveCurrentFilters}>
              <Save size={16} />
              Save Filters
            </button>
          </div>
        </div>
      )}

      {savedFilters.length > 0 && (
        <div className="saved-filters">
          <h4>Saved Filters</h4>
          <div className="saved-filters-list">
            {savedFilters.map((filter, index) => (
              <button
                key={index}
                className="saved-filter-item"
                onClick={() => loadSavedFilters(filter)}
              >
                <Clock size={14} />
                <span>{(filter as any).name || `Filter ${index + 1}`}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusSearch;
