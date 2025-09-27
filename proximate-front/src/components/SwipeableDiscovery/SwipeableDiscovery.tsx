import React, { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Heart,
  X,
  Star,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Home,
} from "lucide-react";
import { HousingOption, SwipeAction } from "../../types";
import { useProximateStore } from "../../store";
import "./SwipeableDiscovery.css";

interface SwipeableDiscoveryProps {
  housingOptions: HousingOption[];
  onSwipe?: (action: SwipeAction) => void;
  onLike?: (housing: HousingOption) => void;
  onDislike?: (housing: HousingOption) => void;
  onSuperLike?: (housing: HousingOption) => void;
}

const SwipeableDiscovery: React.FC<SwipeableDiscoveryProps> = ({
  housingOptions,
  onSwipe,
  onLike,
  onDislike,
  onSuperLike,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addSwipeAction } = useProximateStore();

  const currentHousing = housingOptions[currentIndex];

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

  const handleSwipe = (
    direction: "left" | "right" | "up",
    housing: HousingOption
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);

    const action: SwipeAction = {
      housingId: housing.id,
      action:
        direction === "right"
          ? "like"
          : direction === "up"
          ? "super_like"
          : "dislike",
      timestamp: new Date(),
    };

    addSwipeAction(action);

    if (direction === "right" && onLike) onLike(housing);
    if (direction === "left" && onDislike) onDislike(housing);
    if (direction === "up" && onSuperLike) onSuperLike(housing);

    if (onSwipe) onSwipe(action);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? "right" : "left";
      handleSwipe(direction, currentHousing);
    }
  };

  const handleSuperLike = () => {
    handleSwipe("up", currentHousing);
  };

  const handleLike = () => {
    handleSwipe("right", currentHousing);
  };

  const handleDislike = () => {
    handleSwipe("left", currentHousing);
  };

  return (
    <div className="swipeable-discovery">
      <div className="swipeable-stack">
        {/* Next card (background) */}
        {housingOptions[currentIndex + 1] && (
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
        <HousingCard
          housing={currentHousing}
          onDragEnd={handleDragEnd}
          style={{ zIndex: 2 }}
        />
      </div>

      <div className="swipeable-actions">
        <button
          className="action-button dislike"
          onClick={handleDislike}
          disabled={isAnimating}
        >
          <X size={24} />
        </button>

        <button
          className="action-button super-like"
          onClick={handleSuperLike}
          disabled={isAnimating}
        >
          <Star size={24} />
        </button>

        <button
          className="action-button like"
          onClick={handleLike}
          disabled={isAnimating}
        >
          <Heart size={24} />
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
  style?: React.CSSProperties;
}

const HousingCard: React.FC<HousingCardProps> = ({
  housing,
  onDragEnd,
  style,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      className="housing-card"
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="housing-card-image">
        <img
          src={housing.images[0] || "/placeholder-house.jpg"}
          alt={housing.title}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxODBIMTc1VjEyMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTE5MCAxNDBIMjEwVjE2MEgxOTBWMTQwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib3VzZSBJbWFnZTwvdGV4dD4KPC9zdmc+";
          }}
        />
        <div className="housing-card-price">
          <DollarSign size={16} />
          {housing.price.toLocaleString()}/mo
        </div>
      </div>

      <div className="housing-card-content">
        <div className="housing-card-header">
          <h3 className="housing-title">{housing.title}</h3>
          <div className="housing-rating">
            <Star size={16} fill="#ffd700" color="#ffd700" />
            <span>{housing.landlord.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="housing-location">
          <MapPin size={14} />
          <span>
            {housing.address}, {housing.city}
          </span>
        </div>

        <div className="housing-details">
          <div className="detail-item">
            <Bed size={16} />
            <span>
              {housing.bedrooms} bed{housing.bedrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="detail-item">
            <Bath size={16} />
            <span>
              {housing.bathrooms} bath{housing.bathrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="detail-item">
            <Home size={16} />
            <span>{housing.squareFeet.toLocaleString()} sq ft</span>
          </div>
        </div>

        <div className="housing-amenities">
          {housing.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
            </span>
          ))}
          {housing.amenities.length > 3 && (
            <span className="amenity-tag more">
              +{housing.amenities.length - 3} more
            </span>
          )}
        </div>

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
      </div>
    </motion.div>
  );
};

export default SwipeableDiscovery;
