import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { useProximateStore } from "./store";
import { HousingOption, Collection } from "./types";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CommunityFeatures from "./components/CommunityFeatures/CommunityFeatures";
import Auth from "./components/Auth/Auth";
import CollectionSharing from "./components/CollectionSharing/CollectionSharing";

// Pages
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import CollectionsPage from "./pages/CollectionsPage";
import ProfilePage from "./pages/ProfilePage";

import "./App.css";

function App() {
  const {
    auth,
    housingOptions,
    setHousingOptions,
    collections,
    setCollections,
  } = useProximateStore();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState<HousingOption | null>(
    null
  );
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  // Mock data initialization
  useEffect(() => {
    // Mock housing data
    const mockHousing: HousingOption[] = [
      {
        id: "1",
        title: "Modern Apartment Near Campus",
        description:
          "Beautiful 2-bedroom apartment with modern amenities, perfect for students.",
        address: "123 Main St",
        city: "Blacksburg",
        state: "VA",
        zipCode: "24060",
        price: 1200,
        bedrooms: 2,
        bathrooms: 1.5,
        squareFeet: 950,
        images: ["/placeholder-house.jpg"],
        amenities: ["Parking", "Laundry", "WiFi", "Furnished"],
        coordinates: { lat: 37.2296, lng: -80.4139 },
        distanceToCampus: 0.8,
        distanceToGym: 1.2,
        commuteTime: 12,
        landlord: {
          id: "landlord1",
          name: "VT Properties",
          rating: 4.5,
          responseTime: "2 hours",
        },
        availability: {
          moveInDate: new Date("2024-08-01"),
          leaseLength: 12,
          available: true,
        },
        communityTags: [
          {
            id: "tag1",
            name: "Pet Friendly",
            category: "amenity",
            description: "This building welcomes pets",
            isInclusive: true,
            createdBy: "user1",
            createdAt: new Date(),
          },
        ],
        tenantReviews: [
          {
            id: "review1",
            housingId: "1",
            tenantId: "tenant1",
            rating: 4,
            comment:
              "Great location and responsive landlord. The apartment is well-maintained and the neighbors are quiet.",
            pros: ["Great location", "Responsive landlord", "Quiet neighbors"],
            cons: ["Limited parking"],
            wouldRecommend: true,
            anonymous: false,
            createdAt: new Date(),
            verified: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "Cozy House with Yard",
        description:
          "Charming 3-bedroom house with a private yard, ideal for students who want more space.",
        address: "456 Oak Ave",
        city: "Blacksburg",
        state: "VA",
        zipCode: "24060",
        price: 1800,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1400,
        images: ["/placeholder-house.jpg"],
        amenities: ["Parking", "Laundry", "WiFi", "Yard", "Dishwasher"],
        coordinates: { lat: 37.2356, lng: -80.4089 },
        distanceToCampus: 1.5,
        distanceToGym: 2.0,
        commuteTime: 18,
        landlord: {
          id: "landlord2",
          name: "Hometown Rentals",
          rating: 4.2,
          responseTime: "4 hours",
        },
        availability: {
          moveInDate: new Date("2024-07-15"),
          leaseLength: 12,
          available: true,
        },
        communityTags: [
          {
            id: "tag2",
            name: "Quiet Neighborhood",
            category: "lifestyle",
            description: "Peaceful residential area",
            isInclusive: true,
            createdBy: "user2",
            createdAt: new Date(),
          },
        ],
        tenantReviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Mock collections data
    const mockCollections: Collection[] = [
      {
        id: "collection1",
        userId: "current-user",
        name: "My Favorites",
        housingOptions: ["1", "2"],
        sharedWith: [],
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setHousingOptions(mockHousing);
    setCollections(mockCollections);
  }, [setHousingOptions, setCollections]);

  const handleVoiceTranscript = (transcript: string, entities: any[]) => {
    console.log("Voice transcript:", transcript);
    console.log("Extracted entities:", entities);
    // In a real app, this would update search filters based on extracted entities
  };

  const handleHousingLike = (housing: HousingOption) => {
    console.log("Liked housing:", housing.title);
    // In a real app, this would add to favorites or collections
  };

  const handleHousingDislike = (housing: HousingOption) => {
    console.log("Disliked housing:", housing.title);
  };

  const handleHousingSuperLike = (housing: HousingOption) => {
    console.log("Super liked housing:", housing.title);
  };

  const handleSearch = (filters: any) => {
    console.log("Search filters:", filters);
    // In a real app, this would filter housing options
  };

  const handleCampusChange = (campus: any) => {
    console.log("Campus changed:", campus);
  };

  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />

          <Header
            title="Proximate"
            isAuthenticated={auth.isAuthenticated}
            user={auth.user}
            onAuthClick={() => setShowAuth(true)}
          />

          <main className="App-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/discover"
                element={
                  <DiscoverPage
                    housingOptions={housingOptions}
                    onHousingSelect={setSelectedHousing}
                    onVoiceTranscript={handleVoiceTranscript}
                    onSearch={handleSearch}
                    onCampusChange={handleCampusChange}
                    onLike={handleHousingLike}
                    onDislike={handleHousingDislike}
                    onSuperLike={handleHousingSuperLike}
                  />
                }
              />
              <Route
                path="/collections"
                element={
                  <CollectionsPage
                    collections={collections}
                    housingOptions={housingOptions}
                    onCollectionSelect={setSelectedCollection}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  auth.isAuthenticated ? (
                    <ProfilePage user={auth.user} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </main>

          <Footer />

          {/* Modals */}
          {showAuth && <Auth onClose={() => setShowAuth(false)} />}

          {selectedHousing && (
            <div className="modal-overlay">
              <div className="modal-content housing-modal">
                <div className="modal-header">
                  <h3>{selectedHousing.title}</h3>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedHousing(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <CommunityFeatures
                    housing={selectedHousing}
                    onAddReview={(review) => console.log("Add review:", review)}
                    onAddTag={(tag) => console.log("Add tag:", tag)}
                    onReportReview={(reviewId) =>
                      console.log("Report review:", reviewId)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCollection && (
            <div className="modal-overlay">
              <div className="modal-content collection-modal">
                <div className="modal-header">
                  <h3>{selectedCollection.name}</h3>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedCollection(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <CollectionSharing
                    collection={selectedCollection}
                    housingOptions={housingOptions}
                    onUpdate={(collection) =>
                      console.log("Update collection:", collection)
                    }
                    onDelete={(collectionId) =>
                      console.log("Delete collection:", collectionId)
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
