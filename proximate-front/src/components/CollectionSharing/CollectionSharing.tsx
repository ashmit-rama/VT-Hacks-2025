import React, { useState } from "react";
import {
  Share2,
  Users,
  Copy,
  Mail,
  Link,
  Eye,
  EyeOff,
  Settings,
  Trash2,
} from "lucide-react";
import { Collection, HousingOption } from "../../types";
import { useProximateStore } from "../../store";
import "./CollectionSharing.css";

interface CollectionSharingProps {
  collection: Collection;
  housingOptions: HousingOption[];
  onUpdate?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
}

const CollectionSharing: React.FC<CollectionSharingProps> = ({
  collection,
  housingOptions,
  onUpdate,
  onDelete,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shareMethod, setShareMethod] = useState<"link" | "email" | "roommate">(
    "link"
  );
  const [shareData, setShareData] = useState({
    email: "",
    message: "",
    isPublic: collection.isPublic,
    allowComments: true,
  });
  const [copied, setCopied] = useState(false);

  const { updateCollection, deleteCollection } = useProximateStore();

  const collectionHousing = housingOptions.filter((housing) =>
    collection.housingOptions.includes(housing.id)
  );

  const shareUrl = `${window.location.origin}/collection/${collection.id}`;
  const shareText = `Check out my housing collection: ${collection.name}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(
      `Housing Collection: ${collection.name}`
    );
    const body = encodeURIComponent(`${shareText}\n\nView here: ${shareUrl}`);
    const mailtoUrl = `mailto:${shareData.email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  const handleRoommateInvite = () => {
    // In a real app, this would send an invitation to the roommate
    console.log("Inviting roommate:", shareData.email);
    alert(`Invitation sent to ${shareData.email}`);
  };

  const handleUpdateCollection = (updates: Partial<Collection>) => {
    const updatedCollection = { ...collection, ...updates };
    updateCollection(collection.id, updates);
    if (onUpdate) onUpdate(updatedCollection);
  };

  const handleDeleteCollection = () => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      deleteCollection(collection.id);
      if (onDelete) onDelete(collection.id);
    }
  };

  const handleTogglePublic = () => {
    const newIsPublic = !shareData.isPublic;
    setShareData((prev) => ({ ...prev, isPublic: newIsPublic }));
    handleUpdateCollection({ isPublic: newIsPublic });
  };

  return (
    <div className="collection-sharing">
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
            <span
              className={`visibility ${
                collection.isPublic ? "public" : "private"
              }`}
            >
              {collection.isPublic ? (
                <>
                  <Eye size={14} />
                  Public
                </>
              ) : (
                <>
                  <EyeOff size={14} />
                  Private
                </>
              )}
            </span>
          </div>
        </div>

        <div className="collection-actions">
          <button
            className="action-btn share-btn"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 size={16} />
            Share
          </button>

          <button
            className="action-btn settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="collection-housing">
        <h4>Housing Options</h4>
        <div className="housing-grid">
          {collectionHousing.map((housing) => (
            <div key={housing.id} className="housing-card">
              <div className="housing-image">
                <img
                  src={housing.images[0] || "/placeholder-house.jpg"}
                  alt={housing.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04Ny41IDYwSDEyMi41VjkwSDg3LjVWNjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik05NSA3MEgxMTVWODBIOTVWNzBaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvdXNlIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";
                  }}
                />
              </div>
              <div className="housing-details">
                <h5>{housing.title}</h5>
                <p className="housing-price">
                  ${housing.price.toLocaleString()}/mo
                </p>
                <p className="housing-location">{housing.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSettings && (
        <div className="collection-settings">
          <h4>Collection Settings</h4>
          <div className="settings-options">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={shareData.isPublic}
                  onChange={handleTogglePublic}
                />
                Make collection public
              </label>
              <p>Allow others to discover and view this collection</p>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={shareData.allowComments}
                  onChange={(e) =>
                    setShareData((prev) => ({
                      ...prev,
                      allowComments: e.target.checked,
                    }))
                  }
                />
                Allow comments
              </label>
              <p>Let others comment on housing options in this collection</p>
            </div>
          </div>

          <div className="settings-actions">
            <button className="delete-btn" onClick={handleDeleteCollection}>
              <Trash2 size={16} />
              Delete Collection
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Share Collection</h3>
              <button
                className="close-btn"
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>

            <div className="share-methods">
              <div className="method-tabs">
                <button
                  className={`method-tab ${
                    shareMethod === "link" ? "active" : ""
                  }`}
                  onClick={() => setShareMethod("link")}
                >
                  <Link size={16} />
                  Link
                </button>
                <button
                  className={`method-tab ${
                    shareMethod === "email" ? "active" : ""
                  }`}
                  onClick={() => setShareMethod("email")}
                >
                  <Mail size={16} />
                  Email
                </button>
                <button
                  className={`method-tab ${
                    shareMethod === "roommate" ? "active" : ""
                  }`}
                  onClick={() => setShareMethod("roommate")}
                >
                  <Users size={16} />
                  Roommate
                </button>
              </div>

              <div className="method-content">
                {shareMethod === "link" && (
                  <div className="link-share">
                    <p>Copy this link to share your collection:</p>
                    <div className="link-container">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="share-link-input"
                      />
                      <button className="copy-btn" onClick={handleCopyLink}>
                        <Copy size={16} />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="share-preview">
                      <h4>{collection.name}</h4>
                      <p>{collectionHousing.length} housing options</p>
                      <p>
                        Created{" "}
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {shareMethod === "email" && (
                  <div className="email-share">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={shareData.email}
                        onChange={(e) =>
                          setShareData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="form-group">
                      <label>Message (optional)</label>
                      <textarea
                        value={shareData.message}
                        onChange={(e) =>
                          setShareData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="Add a personal message..."
                        rows={3}
                      />
                    </div>
                    <button
                      className="send-btn"
                      onClick={handleEmailShare}
                      disabled={!shareData.email}
                    >
                      <Mail size={16} />
                      Send Email
                    </button>
                  </div>
                )}

                {shareMethod === "roommate" && (
                  <div className="roommate-share">
                    <div className="form-group">
                      <label>Roommate Email</label>
                      <input
                        type="email"
                        value={shareData.email}
                        onChange={(e) =>
                          setShareData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter roommate's email"
                      />
                    </div>
                    <div className="form-group">
                      <label>Invitation Message</label>
                      <textarea
                        value={shareData.message}
                        onChange={(e) =>
                          setShareData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="Invite them to collaborate on this collection..."
                        rows={3}
                      />
                    </div>
                    <div className="roommate-benefits">
                      <h5>Roommate Benefits:</h5>
                      <ul>
                        <li>View and comment on housing options</li>
                        <li>Add their own housing suggestions</li>
                        <li>Collaborate on decision making</li>
                        <li>Share preferences and requirements</li>
                      </ul>
                    </div>
                    <button
                      className="invite-btn"
                      onClick={handleRoommateInvite}
                      disabled={!shareData.email}
                    >
                      <Users size={16} />
                      Invite Roommate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionSharing;
