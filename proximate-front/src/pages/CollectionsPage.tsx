import React, { useState } from "react";
import {
  Plus,
  Heart,
  Eye,
  EyeOff,
  Settings,
  Share2,
} from "lucide-react";
import { Collection, HousingOption } from "../types";
import "./CollectionsPage.css";

interface CollectionsPageProps {
  collections: Collection[];
  housingOptions: HousingOption[];
  onCollectionSelect: (collection: Collection) => void;
}

const CollectionsPage: React.FC<CollectionsPageProps> = ({
  collections,
  housingOptions,
  onCollectionSelect,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      // In a real app, this would create a new collection
      console.log("Creating collection:", newCollectionName);
      setNewCollectionName("");
      setShowCreateModal(false);
    }
  };

  const getCollectionHousing = (collection: Collection) => {
    return housingOptions.filter((housing) =>
      collection.housingOptions.includes(housing.id)
    );
  };

  return (
    <div className="collections-page">
      <div className="collections-header">
        <div className="collections-title">
          <h1>My Collections</h1>
          <p>Organize and share your favorite housing options</p>
        </div>

        <button
          className="create-collection-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Create Collection
        </button>
      </div>

      <div className="collections-grid">
        {collections.length === 0 ? (
          <div className="empty-collections">
            <Heart size={48} color="#ccc" />
            <h3>No collections yet</h3>
            <p>
              Create your first collection to organize your favorite housing
              options
            </p>
            <button
              className="create-first-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Create Your First Collection
            </button>
          </div>
        ) : (
          collections.map((collection) => {
            const collectionHousing = getCollectionHousing(collection);

            return (
              <div
                key={collection.id}
                className="collection-card"
                onClick={() => onCollectionSelect(collection)}
              >
                <div className="collection-header">
                  <div className="collection-info">
                    <h3>{collection.name}</h3>
                    <div className="collection-meta">
                      <span className="housing-count">
                        {collectionHousing.length} housing option
                        {collectionHousing.length !== 1 ? "s" : ""}
                      </span>
                      <span className="shared-count">
                        Shared with {collection.sharedWith.length} person
                        {collection.sharedWith.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="collection-visibility">
                    {collection.isPublic ? (
                      <div className="visibility-badge public">
                        <Eye size={14} />
                        Public
                      </div>
                    ) : (
                      <div className="visibility-badge private">
                        <EyeOff size={14} />
                        Private
                      </div>
                    )}
                  </div>
                </div>

                <div className="collection-housing-preview">
                  {collectionHousing.slice(0, 3).map((housing) => (
                    <div key={housing.id} className="housing-preview">
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

                <div className="collection-footer">
                  <div className="collection-date">
                    Created{" "}
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </div>

                  <div className="collection-actions">
                    <button
                      className="action-btn share-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCollectionSelect(collection);
                      }}
                    >
                      <Share2 size={14} />
                    </button>

                    <button
                      className="action-btn settings-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCollectionSelect(collection);
                      }}
                    >
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Collection</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
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

              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked />
                  Make collection public
                </label>
                <p>Allow others to discover and view this collection</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
