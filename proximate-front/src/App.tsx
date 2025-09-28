import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useProximateStore } from "./store";
import { HousingOption, Collection } from "./types";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CommunityFeatures from "./components/CommunityFeatures/CommunityFeatures";
import Auth from "./components/Auth/Auth";

// Pages
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import ProfilePage from "./pages/ProfilePage";
import CollectionsPage from "./pages/CollectionsPage";
import AnimatedBackground from "./components/AnimatedBackground/AnimatedBackground";

import "./App.css";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

// Animated page wrapper
const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const {
    auth,
    housingOptions,
    setHousingOptions,
    collections,
    addToSavedCollection,
    createCollection,
    clearCollections,
    logout,
  } = useProximateStore();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState<HousingOption | null>(
    null
  );

  // Fetch real housing data from backend
  useEffect(() => {
    const fetchHousingData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/housing");
        if (response.ok) {
          const data = await response.json();
          setHousingOptions(data.housingOptions || []);
        } else {
          console.error("Failed to fetch housing data");
          // Fallback to empty array if fetch fails
          setHousingOptions([]);
        }
      } catch (error) {
        console.error("Error fetching housing data:", error);
        // Fallback to empty array if fetch fails
        setHousingOptions([]);
      }
    };

    fetchHousingData();
    // Clear any persisted collections to ensure they start empty
    clearCollections();
  }, [setHousingOptions, clearCollections]);

  // Mock data initialization (keeping for reference)
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

    // setHousingOptions(mockHousing); // Commented out - now using real data from backend
    // Clear any persisted collections to ensure they start empty
    // clearCollections(); // Commented out - already called in the real data useEffect
  }, [setHousingOptions, clearCollections]);

  const handleVoiceTranscript = (transcript: string, entities: any[]) => {
    console.log("Voice transcript:", transcript);
    console.log("Extracted entities:", entities);
    // In a real app, this would update search filters based on extracted entities
  };

  const handleHousingLike = (housing: HousingOption) => {
    console.log("Liked housing:", housing.title);
    // Add to "My Favorites" collection
    addToSavedCollection(housing);
  };

  const handleHousingDislike = (housing: HousingOption) => {
    console.log("Disliked housing:", housing.title);
  };

  const handleSearch = (filters: any) => {
    console.log("Search filters:", filters);
    // In a real app, this would filter housing options
  };

  const handleCampusChange = (campus: any) => {
    console.log("Campus changed:", campus);
  };

  const handleCreateCollection = (name: string) => {
    createCollection(name);
  };

  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <AnimatedBackground />
          <Toaster position="top-right" />

          <Header
            title="Proximate"
            isAuthenticated={auth.isAuthenticated}
            user={auth.user}
            onAuthClick={() => setShowAuth(true)}
            onLogout={logout}
          />

          <main className="App-main">
            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/"
                  element={
                    <AnimatedPage>
                      <HomePage />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/discover"
                  element={
                    <AnimatedPage>
                      <DiscoverPage
                        housingOptions={housingOptions}
                        onHousingSelect={setSelectedHousing}
                        onVoiceTranscript={handleVoiceTranscript}
                        onLike={handleHousingLike}
                        onDislike={handleHousingDislike}
                      />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/collections"
                  element={
                    <AnimatedPage>
                      <CollectionsPage
                        collections={collections}
                        housingOptions={housingOptions}
                        onCreateCollection={handleCreateCollection}
                        onCollectionSelect={(collection: Collection) =>
                          console.log("Selected collection:", collection)
                        }
                      />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    auth.isAuthenticated && auth.user ? (
                      <AnimatedPage>
                        <ProfilePage user={auth.user} />
                      </AnimatedPage>
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
              </Routes>
            </AnimatePresence>
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
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
