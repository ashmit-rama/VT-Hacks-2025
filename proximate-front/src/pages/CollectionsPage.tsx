import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Share2 } from "lucide-react";
import { Collection, HousingOption } from "../types";
import AnimatedCard from "../components/AnimatedCard/AnimatedCard";
import AnimatedButton from "../components/AnimatedButton/AnimatedButton";
import { useProximateStore } from "../store";
import "./CollectionsPage.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const collectionVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
};

interface CollectionsPageProps {
  collections: Collection[];
  housingOptions: HousingOption[];
  onCreateCollection: (name: string) => void;
  onCollectionSelect: (collection: Collection) => void;
}

const CollectionsPage: React.FC<CollectionsPageProps> = ({
  collections,
  housingOptions,
  onCreateCollection,
  onCollectionSelect,
}) => {
  const { shareCollection } = useProximateStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showCollectionDetail, setShowCollectionDetail] =
    useState<Collection | null>(null);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName("");
      setShowCreateModal(false);
    }
  };

  const getCollectionHousing = (collection: Collection) => {
    return collection.housingOptions || [];
  };

  return (
    <div className="collections-page">
      <motion.div
        className="collections-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="collections-title"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1>My Collections</h1>
          <p>Organize and share your favorite housing options</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <AnimatedButton
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={<Plus size={20} />}
          >
            New Collection
          </AnimatedButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="collections-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {collections.length === 0 ? (
          <motion.div
            className="empty-collections"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              No collections yet
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              Create your first collection to organize your favorite housing
              options
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <AnimatedButton
                variant="gradient"
                size="large"
                onClick={() => setShowCreateModal(true)}
                icon={<Plus size={20} />}
              >
                Create Your First Collection
              </AnimatedButton>
            </motion.div>
          </motion.div>
        ) : (
          collections.map((collection, index) => {
            const collectionHousing = getCollectionHousing(collection);

            return (
              <motion.div
                key={collection.id}
                variants={collectionVariants}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
              >
                <AnimatedCard
                  className="collection-card"
                  onClick={() => setShowCollectionDetail(collection)}
                  glowColor={
                    collection.name === "My Favorites"
                      ? "#ffd700"
                      : collection.name === "Saved Collection"
                      ? "#4ecdc4"
                      : "#667eea"
                  }
                  delay={index * 0.1}
                >
                  <div className="collection-header">
                    <div className="collection-info">
                      <h3>{collection.name}</h3>
                      <div className="collection-meta">
                        <span className="housing-count">
                          {collectionHousing.length} housing option
                          {collectionHousing.length !== 1 ? "s" : ""}
                        </span>
                        <span className="created-date">
                          Created{" "}
                          {new Date(collection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="collection-housing-preview">
                    {collection.name === "My Favorites" ||
                    collection.name === "Saved Collection" ? (
                      <div className="collection-grid-preview">
                        <div className="grid-container-2x2">
                          {collectionHousing
                            .slice(0, 4)
                            .map((housing, index) => (
                              <div key={housing.id} className="grid-item">
                                <img
                                  src={
                                    housing.images[0] ||
                                    "/placeholder-house.jpg"
                                  }
                                  alt={housing.title}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zNSAyNEg0NVYzNkgzNVYyNFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTM4IDI4SDQyVjMySDM4VjI4WiIgZmlsbD0iI0NDQ0NDQyIvPgo8dGV4dCB4PSI0MCIgeT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib3VzZTwvdGV4dD4KPC9zdmc+";
                                  }}
                                />
                              </div>
                            ))}
                          {Array.from({
                            length: Math.max(0, 4 - collectionHousing.length),
                          }).map((_, index) => (
                            <div
                              key={`empty-${index}`}
                              className="grid-item empty"
                            >
                              <div className="empty-slot"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="collection-housing-list">
                        {collectionHousing.slice(0, 3).map((housing) => (
                          <div key={housing.id} className="housing-preview">
                            <div className="housing-image">
                              <img
                                src={
                                  housing.images[0] || "/placeholder-house.jpg"
                                }
                                alt={housing.title}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zNSAyNEg0NVYzNkgzNVYyNFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTM4IDI4SDQyVjMySDM4VjI4WiIgZmlsbD0iI0NDQ0NDQyIvPgo8dGV4dCB4PSI0MCIgeT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib3VzZTwvdGV4dD4KPC9zdmc+";
                                }}
                              />
                            </div>
                            <div className="housing-details">
                              <h4>{housing.title}</h4>
                              <p>${housing.price.toLocaleString()}/mo</p>
                            </div>
                          </div>
                        ))}

                        {collectionHousing.length > 3 && (
                          <div className="more-housing">
                            +{collectionHousing.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              </motion.div>
            );
          })
        )}
      </motion.div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Create New Collection</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="collection-name">Collection Name</label>
                  <input
                    type="text"
                    id="collection-name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Enter collection name..."
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-footer">
                <AnimatedButton
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  variant="gradient"
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                >
                  Create Collection
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCollectionDetail && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCollectionDetail(null)}
          >
            <motion.div
              className="collection-detail-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{showCollectionDetail.name}</h3>
                <div className="modal-header-actions">
                  <button
                    className="share-btn"
                    onClick={async () => {
                      const username = prompt("Enter roommate username:");
                      if (username) {
                        try {
                          await shareCollection(
                            showCollectionDetail.id,
                            username,
                            false
                          );
                          alert(
                            `Collection shared with ${username} successfully!`
                          );
                        } catch (error) {
                          alert(
                            `Error sharing collection: ${
                              error instanceof Error
                                ? error.message
                                : "Unknown error"
                            }`
                          );
                        }
                      }
                    }}
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                  <button
                    className="close-btn"
                    onClick={() => setShowCollectionDetail(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="collection-detail-content">
                <div className="collection-info">
                  <p>{showCollectionDetail.description}</p>
                  <div className="collection-stats">
                    <span>
                      {getCollectionHousing(showCollectionDetail).length}{" "}
                      housing options
                    </span>
                    <span>
                      Created{" "}
                      {new Date(
                        showCollectionDetail.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="housing-list">
                  {getCollectionHousing(showCollectionDetail).map((housing) => (
                    <div
                      key={housing.id}
                      className="housing-list-item"
                      onClick={() => {
                        console.log("View housing:", housing);
                      }}
                    >
                      <div className="housing-image">
                        <img
                          src={housing.images[0] || "/placeholder-house.jpg"}
                          alt={housing.title}
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zNSAyNEg0NVYzNkgzNVYyNFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTM4IDI4SDQyVjMySDM4VjI4WiIgZmlsbD0iI0NDQ0NDQyIvPgo8dGV4dCB4PSI0MCIgeT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib3VzZTwvdGV4dD4KPC9zdmc+";
                          }}
                        />
                      </div>
                      <div className="housing-details">
                        <div className="housing-header">
                          <h4>{housing.title}</h4>
                          <div className="housing-price">
                            ${housing.price.toLocaleString()}/mo
                          </div>
                        </div>
                        <p className="housing-location">
                          {housing.address}, {housing.city}, {housing.state}
                        </p>
                        <div className="housing-amenities">
                          {housing.amenities
                            .slice(0, 4)
                            .map((amenity, index) => (
                              <span key={index} className="amenity-tag">
                                {amenity}
                              </span>
                            ))}
                          {housing.amenities.length > 4 && (
                            <span className="amenity-tag more">
                              +{housing.amenities.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionsPage;
