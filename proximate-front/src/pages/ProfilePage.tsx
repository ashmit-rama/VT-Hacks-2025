import React, { useState } from "react";
import { User, Settings, LogOut, Edit, Save, X } from "lucide-react";
import { User as UserType } from "../types";
import "./ProfilePage.css";

interface ProfilePageProps {
  user: UserType | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>User not found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would save the user data
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        preferences: {
          ...editedUser.preferences,
          [field]: value,
        },
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={48} color="#61dafb" />
        </div>

        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-role">
            <span className={`role-badge ${user.role}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button className="action-btn save-btn" onClick={handleSave}>
                <Save size={16} />
                Save
              </button>
              <button className="action-btn cancel-btn" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="action-btn edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              ) : (
                <span>{user.name}</span>
              )}
            </div>

            <div className="info-item">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>

            <div className="info-item">
              <label>Role</label>
              {isEditing ? (
                <select
                  value={editedUser?.role || "student"}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="tenant">Tenant</option>
                  <option value="landlord">Landlord</option>
                </select>
              ) : (
                <span>{user.role}</span>
              )}
            </div>

            <div className="info-item">
              <label>Member Since</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Housing Preferences</h2>
          <div className="preferences-grid">
            <div className="preference-item">
              <label>Commute Mode</label>
              {isEditing ? (
                <select
                  value={editedUser?.preferences.commuteMode || "walking"}
                  onChange={(e) =>
                    handlePreferenceChange("commuteMode", e.target.value)
                  }
                >
                  <option value="walking">Walking</option>
                  <option value="biking">Biking</option>
                  <option value="driving">Driving</option>
                  <option value="public_transport">Public Transport</option>
                </select>
              ) : (
                <span>{user.preferences.commuteMode.replace("_", " ")}</span>
              )}
            </div>

            <div className="preference-item">
              <label>Max Commute Time</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedUser?.preferences.commuteTime || 15}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "commuteTime",
                      parseInt(e.target.value)
                    )
                  }
                  min="5"
                  max="60"
                />
              ) : (
                <span>{user.preferences.commuteTime} minutes</span>
              )}
            </div>

            <div className="preference-item">
              <label>Budget Range</label>
              {isEditing ? (
                <div className="budget-inputs">
                  <input
                    type="number"
                    value={editedUser?.preferences.budget.min || 500}
                    onChange={(e) =>
                      handlePreferenceChange("budget", {
                        ...editedUser?.preferences.budget,
                        min: parseInt(e.target.value),
                      })
                    }
                    placeholder="Min"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={editedUser?.preferences.budget.max || 1200}
                    onChange={(e) =>
                      handlePreferenceChange("budget", {
                        ...editedUser?.preferences.budget,
                        max: parseInt(e.target.value),
                      })
                    }
                    placeholder="Max"
                  />
                </div>
              ) : (
                <span>
                  ${user.preferences.budget.min} - $
                  {user.preferences.budget.max}
                </span>
              )}
            </div>

            <div className="preference-item">
              <label>Campus</label>
              {isEditing ? (
                <select
                  value={editedUser?.preferences.campus || "blacksburg"}
                  onChange={(e) =>
                    handlePreferenceChange("campus", e.target.value)
                  }
                >
                  <option value="blacksburg">Blacksburg</option>
                  <option value="roanoke">Roanoke</option>
                  <option value="arlington">Arlington</option>
                  <option value="richmond">Richmond</option>
                </select>
              ) : (
                <span>{user.preferences.campus}</span>
              )}
            </div>

            <div className="preference-item">
              <label>Quiet Hours</label>
              {isEditing ? (
                <div className="time-inputs">
                  <input
                    type="time"
                    value={editedUser?.preferences.quietHours.start || "22:00"}
                    onChange={(e) =>
                      handlePreferenceChange("quietHours", {
                        ...editedUser?.preferences.quietHours,
                        start: e.target.value,
                      })
                    }
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={editedUser?.preferences.quietHours.end || "08:00"}
                    onChange={(e) =>
                      handlePreferenceChange("quietHours", {
                        ...editedUser?.preferences.quietHours,
                        end: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <span>
                  {user.preferences.quietHours.start} -{" "}
                  {user.preferences.quietHours.end}
                </span>
              )}
            </div>

            <div className="preference-item">
              <label>Must-Have Amenities</label>
              {isEditing ? (
                <div className="amenities-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      checked={editedUser?.preferences.petFriendly || false}
                      onChange={(e) =>
                        handlePreferenceChange("petFriendly", e.target.checked)
                      }
                    />
                    Pet Friendly
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editedUser?.preferences.furnished || false}
                      onChange={(e) =>
                        handlePreferenceChange("furnished", e.target.checked)
                      }
                    />
                    Furnished
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editedUser?.preferences.parking || false}
                      onChange={(e) =>
                        handlePreferenceChange("parking", e.target.checked)
                      }
                    />
                    Parking
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editedUser?.preferences.laundry || false}
                      onChange={(e) =>
                        handlePreferenceChange("laundry", e.target.checked)
                      }
                    />
                    Laundry
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editedUser?.preferences.wifi || false}
                      onChange={(e) =>
                        handlePreferenceChange("wifi", e.target.checked)
                      }
                    />
                    WiFi
                  </label>
                </div>
              ) : (
                <div className="amenities-list">
                  {[
                    user.preferences.petFriendly && "Pet Friendly",
                    user.preferences.furnished && "Furnished",
                    user.preferences.parking && "Parking",
                    user.preferences.laundry && "Laundry",
                    user.preferences.wifi && "WiFi",
                  ]
                    .filter(Boolean)
                    .join(", ") || "None specified"}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Settings</h2>
          <div className="settings-actions">
            <button className="settings-btn">
              <Settings size={16} />
              Account Settings
            </button>
            <button className="logout-btn">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
