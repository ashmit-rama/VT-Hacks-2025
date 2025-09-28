import React, { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Heart,
  X,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Home,
  Star,
} from "lucide-react";
import { HousingOption, SwipeAction } from "../../types";
import { useProximateStore } from "../../store";
import AnimatedCard from "../AnimatedCard/AnimatedCard";
import AnimatedButton from "../AnimatedButton/AnimatedButton";
import "./SwipeableDiscovery.css";

interface SwipeableDiscoveryProps {
  housingOptions: HousingOption[];
  onSwipe?: (action: SwipeAction) => void;
  onLike?: (housing: HousingOption) => void;
  onDislike?: (housing: HousingOption) => void;
}

const SwipeableDiscovery: React.FC<SwipeableDiscoveryProps> = ({
  housingOptions,
  onSwipe,
  onLike,
  onDislike,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tiltDirection, setTiltDirection] = useState<"left" | "right" | null>(
    null
  );

  // Reset currentIndex when housingOptions change (e.g., new search results)
  useEffect(() => {
    setCurrentIndex(0);
  }, [housingOptions]);
  const { addSwipeAction, addToSavedCollection, addToMyFavorites } =
    useProximateStore();

  const currentHousing = housingOptions[currentIndex];

  const handleSwipe = useCallback(
    (direction: "left" | "right", housing: HousingOption) => {
      if (isAnimating) return;

      setIsAnimating(true);

      const action: SwipeAction = {
        housingId: housing.id,
        action: direction === "right" ? "like" : "dislike",
        timestamp: new Date(),
      };

      addSwipeAction(action);

      if (direction === "right") {
        console.log("🔄 Calling addToSavedCollection for:", housing.title);
        addToSavedCollection(housing);
        if (onLike) onLike(housing);
      }
      if (direction === "left" && onDislike) onDislike(housing);

      if (onSwipe) onSwipe(action);

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    },
    [
      isAnimating,
      addSwipeAction,
      addToSavedCollection,
      onLike,
      onDislike,
      onSwipe,
    ]
  );

  // Keyboard event handling
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isAnimating) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (currentHousing) {
            setTiltDirection("left");
            setTimeout(() => {
              setTiltDirection(null); // Reset to center
              setTimeout(() => {
                handleSwipe("left", currentHousing);
              }, 100); // Wait for reset animation
            }, 150);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (currentHousing) {
            setTiltDirection("right");
            setTimeout(() => {
              setTiltDirection(null); // Reset to center
              setTimeout(() => {
                // Right arrow = Add to Saved Collection (shared)
                console.log("🔄 Right arrow: Adding to Saved Collection");
                addToSavedCollection(currentHousing);
                setCurrentIndex((prev) => prev + 1);
              }, 100); // Wait for reset animation
            }, 150);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (currentHousing) {
            // Down arrow = Add to My Favorites (private)
            console.log("⭐ Down arrow: Adding to My Favorites");
            addToMyFavorites(currentHousing);
            // Move to next card after adding to favorites
            setTimeout(() => {
              setCurrentIndex((prev) => prev + 1);
            }, 300);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    currentHousing,
    isAnimating,
    handleSwipe,
    addToSavedCollection,
    addToMyFavorites,
  ]);

  if (!currentHousing) {
    return (
      <div className="swipeable-discovery-empty">
        <div className="empty-state">
          <Heart size={48} color="#ccc" />
          <h3>No more housing options</h3>
          <p>You've seen all available options. Try adjusting your filters!</p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? "right" : "left";
      handleSwipe(direction, currentHousing);
    }
  };

  const handleLike = () => {
    console.log("💖 Save button clicked for:", currentHousing.title);
    handleSwipe("right", currentHousing);
  };

  const handleDislike = () => {
    handleSwipe("left", currentHousing);
  };

  return (
    <div className="swipeable-discovery">
      <div className="swipeable-stack">
        {/* Next card (background) - hidden for single card view */}
        {false && housingOptions[currentIndex + 1] && (
          <HousingCard
            housing={housingOptions[currentIndex + 1]}
            style={{
              scale: 0.95,
              opacity: 0.7,
              zIndex: 1,
            }}
          />
        )}

        {/* Current card */}
        <AnimatedCard className="housing-card-wrapper" glowColor="#667eea">
          <HousingCard
            housing={currentHousing}
            onDragEnd={handleDragEnd}
            tiltDirection={tiltDirection}
            style={{ zIndex: 2 }}
          />
        </AnimatedCard>
      </div>

      <div className="swipeable-actions">
        <AnimatedButton
          variant="glow"
          size="large"
          onClick={handleDislike}
          disabled={isAnimating}
          glowColor="#ff6b6b"
          icon={<X size={24} />}
        >
          Pass
        </AnimatedButton>

        <AnimatedButton
          variant="glow"
          size="large"
          onClick={() => addToMyFavorites(currentHousing)}
          disabled={isAnimating}
          glowColor="#ffd700"
          icon={<Star size={24} />}
        >
          Favorite
        </AnimatedButton>

        <AnimatedButton
          variant="glow"
          size="large"
          onClick={handleLike}
          disabled={isAnimating}
          glowColor="#4ecdc4"
          icon={<Heart size={24} />}
        >
          Save
        </AnimatedButton>

        {/* DEBUG: Test Collection Creation Button */}
        <button
          onClick={() => {
            console.log("🧪 TEST BUTTON CLICKED");
            if (housingOptions.length > 0) {
              console.log(
                "🧪 Testing with housing:",
                housingOptions[currentIndex].title
              );
              addToSavedCollection(housingOptions[currentIndex]);
            }
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#ff6b6b",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          TEST SAVE
        </button>

        {/* DEBUG: Test Star Button */}
        <button
          onClick={() => {
            console.log("⭐ TEST STAR BUTTON CLICKED");
            if (housingOptions.length > 0) {
              console.log(
                "⭐ Testing with housing:",
                housingOptions[currentIndex].title
              );
              addToMyFavorites(housingOptions[currentIndex]);
            }
          }}
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            background: "#ffd700",
            color: "black",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          TEST STAR
        </button>
      </div>

      <div className="swipeable-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / housingOptions.length) * 100}%`,
            }}
          />
        </div>
        <span className="progress-text">
          {currentIndex + 1} of {housingOptions.length}
        </span>
      </div>
    </div>
  );
};

interface HousingCardProps {
  housing: HousingOption;
  onDragEnd?: (event: any, info: PanInfo) => void;
  tiltDirection?: "left" | "right" | null;
  style?: React.CSSProperties;
}

const HousingCard: React.FC<HousingCardProps> = ({
  housing,
  onDragEnd,
  tiltDirection,
  style,
}) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Calculate tilt animation based on direction
  const getTiltAnimation = () => {
    if (!tiltDirection) return {};

    switch (tiltDirection) {
      case "left":
        return {
          rotate: -45,
          x: -80,
          transition: {
            duration: 0.15,
            ease: "easeOut",
          },
        };
      case "right":
        return {
          rotate: 45,
          x: 80,
          transition: {
            duration: 0.15,
            ease: "easeOut",
          },
        };
      default:
        return {};
    }
  };

  // Reset animation when tiltDirection becomes null
  const getResetAnimation = () => {
    if (tiltDirection === null) {
      return {
        rotate: 0,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.1,
          ease: "easeInOut",
        },
      };
    }
    return {};
  };

  return (
    <motion.div
      className="housing-card"
      style={{
        opacity,
        ...style,
      }}
      initial={{
        scale: 0.8,
        opacity: 0,
        y: 50,
        rotateX: -15,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        ...getTiltAnimation(),
        ...getResetAnimation(),
      }}
      exit={{
        scale: 0.8,
        opacity: 0,
        y: -50,
        rotateX: 15,
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6,
      }}
    >
      <motion.div
        className="housing-card-image"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          src={housing.images[0] || "/placeholder-house.jpg"}
          alt={housing.title}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxODBIMTc1VjEyMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTE5MCAxNDBIMjEwVjE2MEgxOTBWMTQwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib3VzZSBJbWFnZTwvdGV4dD4KPC9zdmc+";
          }}
        />
        <motion.div
          className="housing-card-price"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
        >
          <DollarSign size={16} />
          {housing.price.toLocaleString()}/mo
        </motion.div>
      </motion.div>

      <motion.div
        className="housing-card-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          className="housing-card-header"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <motion.h3
            className="housing-title"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {housing.title}
          </motion.h3>
          <motion.div
            className="housing-rating"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Star size={16} fill="#ffd700" color="#ffd700" />
            <span>{housing.landlord.rating.toFixed(1)}</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="housing-location"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <MapPin size={14} />
          <span>
            {housing.address}, {housing.city}
          </span>
        </motion.div>

        <motion.div
          className="housing-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <motion.div
            className="detail-item"
            whileHover={{ scale: 1.1, x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Bed size={16} />
            <span>
              {housing.bedrooms} bed{housing.bedrooms !== 1 ? "s" : ""}
            </span>
          </motion.div>
          <motion.div
            className="detail-item"
            whileHover={{ scale: 1.1, x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Bath size={16} />
            <span>
              {housing.bathrooms} bath{housing.bathrooms !== 1 ? "s" : ""}
            </span>
          </motion.div>
          <motion.div
            className="detail-item"
            whileHover={{ scale: 1.1, x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Home size={16} />
            <span>{housing.squareFeet.toLocaleString()} sq ft</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="housing-amenities"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          {housing.amenities.slice(0, 3).map((amenity, index) => (
            <motion.span
              key={index}
              className="amenity-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              {amenity}
            </motion.span>
          ))}
          {housing.amenities.length > 3 && (
            <motion.span
              className="amenity-tag more"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              +{housing.amenities.length - 3} more
            </motion.span>
          )}
        </motion.div>

        <div className="housing-distance">
          <div className="distance-item">
            <span className="distance-label">Campus:</span>
            <span className="distance-value">
              {housing.distanceToCampus.toFixed(1)} mi
            </span>
          </div>
          <div className="distance-item">
            <span className="distance-label">Commute:</span>
            <span className="distance-value">{housing.commuteTime} min</span>
          </div>
        </div>

        {housing.communityTags.length > 0 && (
          <div className="community-tags">
            <span className="tags-label">Community:</span>
            <div className="tags-list">
              {housing.communityTags.slice(0, 2).map((tag) => (
                <span key={tag.id} className="community-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SwipeableDiscovery;
