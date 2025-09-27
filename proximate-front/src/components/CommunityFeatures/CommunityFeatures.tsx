import React, { useState } from "react";
import {
  MessageCircle,
  Users,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Star,
  Clock,
} from "lucide-react";
import { HousingOption, TenantReview, CommunityTag } from "../../types";
import "./CommunityFeatures.css";

interface CommunityFeaturesProps {
  housing: HousingOption;
  onAddReview?: (review: Omit<TenantReview, "id" | "createdAt">) => void;
  onAddTag?: (tag: Omit<CommunityTag, "id" | "createdAt">) => void;
  onReportReview?: (reviewId: string) => void;
}

const CommunityFeatures: React.FC<CommunityFeaturesProps> = ({
  housing,
  onAddReview,
  onAddTag,
  onReportReview,
}) => {
  const [activeTab, setActiveTab] = useState<"reviews" | "tags" | "community">(
    "reviews"
  );
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);

  const averageRating =
    housing.tenantReviews.length > 0
      ? housing.tenantReviews.reduce((sum, review) => sum + review.rating, 0) /
        housing.tenantReviews.length
      : 0;

  const verifiedReviews = housing.tenantReviews.filter(
    (review) => review.verified
  );

  return (
    <div className="community-features">
      <div className="community-header">
        <h3>Community Insights</h3>
        <div className="community-stats">
          <div className="stat-item">
            <Users size={16} />
            <span>{housing.tenantReviews.length} reviews</span>
          </div>
          <div className="stat-item">
            <Star size={16} />
            <span>{averageRating.toFixed(1)} avg rating</span>
          </div>
          <div className="stat-item">
            <Shield size={16} />
            <span>{verifiedReviews.length} verified</span>
          </div>
        </div>
      </div>

      <div className="community-tabs">
        <button
          className={`tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <MessageCircle size={16} />
          Reviews
        </button>
        <button
          className={`tab ${activeTab === "tags" ? "active" : ""}`}
          onClick={() => setActiveTab("tags")}
        >
          <Users size={16} />
          Community Tags
        </button>
        <button
          className={`tab ${activeTab === "community" ? "active" : ""}`}
          onClick={() => setActiveTab("community")}
        >
          <Shield size={16} />
          Safety & Moderation
        </button>
      </div>

      <div className="community-content">
        {activeTab === "reviews" && (
          <div className="reviews-section">
            <div className="reviews-header">
              <h4>Tenant Reviews</h4>
              <button
                className="add-review-btn"
                onClick={() => setShowAddReview(true)}
              >
                Add Review
              </button>
            </div>

            {housing.tenantReviews.length === 0 ? (
              <div className="empty-reviews">
                <MessageCircle size={32} color="#ccc" />
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {housing.tenantReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onReport={() => onReportReview?.(review.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "tags" && (
          <div className="tags-section">
            <div className="tags-header">
              <h4>Community Tags</h4>
              <button
                className="add-tag-btn"
                onClick={() => setShowAddTag(true)}
              >
                Add Tag
              </button>
            </div>

            <div className="tags-grid">
              {housing.communityTags.map((tag) => (
                <TagCard key={tag.id} tag={tag} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <div className="moderation-section">
            <div className="moderation-info">
              <Shield size={24} color="#4caf50" />
              <h4>Community Safety</h4>
              <p>
                All reviews and tags are moderated to ensure authenticity and
                safety.
              </p>
            </div>

            <div className="moderation-features">
              <div className="feature-item">
                <ThumbsUp size={16} />
                <span>Verified tenant reviews only</span>
              </div>
              <div className="feature-item">
                <Flag size={16} />
                <span>Report inappropriate content</span>
              </div>
              <div className="feature-item">
                <Users size={16} />
                <span>Anonymous options available</span>
              </div>
              <div className="feature-item">
                <Clock size={16} />
                <span>24/7 moderation team</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddReview && (
        <AddReviewModal
          housingId={housing.id}
          onClose={() => setShowAddReview(false)}
          onSubmit={(review) => {
            onAddReview?.(review);
            setShowAddReview(false);
          }}
        />
      )}

      {showAddTag && (
        <AddTagModal
          housingId={housing.id}
          onClose={() => setShowAddTag(false)}
          onSubmit={(tag) => {
            onAddTag?.(tag);
            setShowAddTag(false);
          }}
        />
      )}
    </div>
  );
};

interface ReviewCardProps {
  review: TenantReview;
  onReport: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onReport }) => {
  const [showFullReview, setShowFullReview] = useState(false);

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">{review.anonymous ? "A" : "T"}</div>
          <div className="reviewer-details">
            <span className="reviewer-name">
              {review.anonymous ? "Anonymous Tenant" : "Verified Tenant"}
            </span>
            <div className="review-meta">
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < review.rating ? "#ffd700" : "#ddd"}
                    color={i < review.rating ? "#ffd700" : "#ddd"}
                  />
                ))}
              </div>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              {review.verified && (
                <span className="verified-badge">Verified</span>
              )}
            </div>
          </div>
        </div>
        <button className="report-btn" onClick={onReport}>
          <Flag size={14} />
        </button>
      </div>

      <div className="review-content">
        <p className={`review-text ${showFullReview ? "expanded" : ""}`}>
          {review.comment}
        </p>
        {review.comment.length > 150 && (
          <button
            className="expand-btn"
            onClick={() => setShowFullReview(!showFullReview)}
          >
            {showFullReview ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <div className="review-pros-cons">
        {review.pros.length > 0 && (
          <div className="pros-section">
            <h5>Pros:</h5>
            <ul>
              {review.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>
        )}

        {review.cons.length > 0 && (
          <div className="cons-section">
            <h5>Cons:</h5>
            <ul>
              {review.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="review-footer">
        <div className="recommendation">
          {review.wouldRecommend ? (
            <div className="recommend-yes">
              <ThumbsUp size={14} />
              <span>Would recommend</span>
            </div>
          ) : (
            <div className="recommend-no">
              <ThumbsDown size={14} />
              <span>Would not recommend</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TagCardProps {
  tag: CommunityTag;
}

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <div className={`tag-card ${tag.category}`}>
      <div className="tag-header">
        <span className="tag-name">{tag.name}</span>
        <span className="tag-category">{tag.category}</span>
      </div>
      <p className="tag-description">{tag.description}</p>
      <div className="tag-footer">
        <span className="tag-inclusive">
          {tag.isInclusive ? "Inclusive" : "Specific"}
        </span>
        <span className="tag-date">
          {new Date(tag.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

interface AddReviewModalProps {
  housingId: string;
  onClose: () => void;
  onSubmit: (review: Omit<TenantReview, "id" | "createdAt">) => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  housingId,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      housingId,
      tenantId: "current-user",
      rating,
      comment,
      pros: pros.filter((p) => p.trim()),
      cons: cons.filter((c) => c.trim()),
      wouldRecommend,
      anonymous,
      verified: false,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Review</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`star-btn ${i < rating ? "active" : ""}`}
                  onClick={() => setRating(i + 1)}
                >
                  <Star size={20} fill={i < rating ? "#ffd700" : "#ddd"} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Pros</label>
            {pros.map((pro, index) => (
              <input
                key={index}
                type="text"
                value={pro}
                onChange={(e) => {
                  const newPros = [...pros];
                  newPros[index] = e.target.value;
                  setPros(newPros);
                }}
                placeholder="What did you like?"
              />
            ))}
            <button
              type="button"
              onClick={() => setPros([...pros, ""])}
              className="add-item-btn"
            >
              + Add Pro
            </button>
          </div>

          <div className="form-group">
            <label>Cons</label>
            {cons.map((con, index) => (
              <input
                key={index}
                type="text"
                value={con}
                onChange={(e) => {
                  const newCons = [...cons];
                  newCons[index] = e.target.value;
                  setCons(newCons);
                }}
                placeholder="What could be improved?"
              />
            ))}
            <button
              type="button"
              onClick={() => setCons([...cons, ""])}
              className="add-item-btn"
            >
              + Add Con
            </button>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
              />
              Would recommend to others
            </label>

            <label>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              Post anonymously
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddTagModalProps {
  housingId: string;
  onClose: () => void;
  onSubmit: (tag: Omit<CommunityTag, "id" | "createdAt">) => void;
}

const AddTagModal: React.FC<AddTagModalProps> = ({
  housingId,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "interest" | "activity" | "lifestyle" | "amenity"
  >("interest");
  const [isInclusive, setIsInclusive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      category,
      isInclusive,
      createdBy: "current-user",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Community Tag</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tag-form">
          <div className="form-group">
            <label>Tag Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Pet-friendly, Quiet, Social"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this tag means..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="interest">Interest</option>
              <option value="activity">Activity</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="amenity">Amenity</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isInclusive}
                onChange={(e) => setIsInclusive(e.target.checked)}
              />
              This tag is inclusive and welcoming
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityFeatures;
