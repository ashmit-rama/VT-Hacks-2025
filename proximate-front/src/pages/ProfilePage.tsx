import React from "react";
import { motion } from "framer-motion";
import { User } from "../types";
import "./ProfilePage.css";

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  // Add default values and null checks for user preferences
  const preferences = user.preferences || {};
  const priceRange = preferences.priceRange || { min: 0, max: 0 };

  return (
    <div className="profile-page">
      <motion.div
        className="profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="profile-header">
          <h1>Profile</h1>
        </div>

        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-info">
            <div className="info-item">
              <label>Username</label>
              <span>{user.username || "Not set"}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{user.email || "Not set"}</span>
            </div>
            <div className="info-item">
              <label>Name</label>
              <span>
                {user.firstName || ""} {user.lastName || ""}
              </span>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <span>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Housing Preferences</h2>
          <div className="preferences-grid">
            <div className="preference-item">
              <label>Campus</label>
              <span>{preferences.campus || "Not specified"}</span>
            </div>
            <div className="preference-item">
              <label>Price Range</label>
              <span>
                {priceRange.min > 0 && priceRange.max > 0
                  ? `$${priceRange.min} - $${priceRange.max}`
                  : "Not specified"}
              </span>
            </div>
            <div className="preference-item">
              <label>Max Distance to Campus</label>
              <span>
                {preferences.distanceToCampus
                  ? `${preferences.distanceToCampus} miles`
                  : "Not specified"}
              </span>
            </div>
            <div className="preference-item">
              <label>Lease Length</label>
              <span>
                {preferences.leaseLength
                  ? `${preferences.leaseLength} months`
                  : "Not specified"}
              </span>
            </div>
            <div className="preference-item">
              <label>Must-Have Amenities</label>
              <div className="amenities-list">
                {[
                  preferences.petFriendly && "Pet Friendly",
                  preferences.furnished && "Furnished",
                  preferences.parking && "Parking",
                  preferences.laundry && "Laundry",
                  preferences.wifi && "WiFi",
                ]
                  .filter(Boolean)
                  .join(", ") || "None specified"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
