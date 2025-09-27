import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";
import { useProximateStore } from "../../store";
import { User as UserType } from "../../types";
import "./Auth.css";

interface AuthProps {
  onClose?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "student" as "student" | "tenant" | "landlord",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setAuthLoading, setAuthError } = useProximateStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (mode === "register") {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setAuthLoading(true);
    setAuthError(null);

    try {
      // Mock authentication - in real app, this would call your auth API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (mode === "login") {
        // Mock login
        const mockUser: UserType = {
          id: "1",
          email: formData.email,
          name: "John Doe",
          role: "student",
          preferences: {
            commuteMode: "walking",
            commuteTime: 15,
            budget: { min: 500, max: 1200 },
            quietHours: { start: "22:00", end: "08:00" },
            interests: ["studying", "fitness", "cooking"],
            accessibilityNeeds: [],
            campus: "blacksburg",
            schoolDistance: 1.5,
            gymDistance: 2.0,
            petFriendly: false,
            furnished: true,
            parking: true,
            laundry: true,
            wifi: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setUser(mockUser);
      } else if (mode === "register") {
        // Mock registration
        const mockUser: UserType = {
          id: "2",
          email: formData.email,
          name: formData.name,
          role: formData.role,
          preferences: {
            commuteMode: "walking",
            commuteTime: 15,
            budget: { min: 500, max: 1200 },
            quietHours: { start: "22:00", end: "08:00" },
            interests: [],
            accessibilityNeeds: [],
            campus: "blacksburg",
            schoolDistance: 1.5,
            gymDistance: 2.0,
            petFriendly: false,
            furnished: true,
            parking: true,
            laundry: true,
            wifi: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setUser(mockUser);
      }

      if (onClose) onClose();
    } catch (error) {
      setAuthError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };

  const handleSSOLogin = async (provider: "google" | "microsoft") => {
    setIsLoading(true);
    setAuthLoading(true);

    try {
      // Mock SSO login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: UserType = {
        id: "3",
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        role: "student",
        preferences: {
          commuteMode: "walking",
          commuteTime: 15,
          budget: { min: 500, max: 1200 },
          quietHours: { start: "22:00", end: "08:00" },
          interests: [],
          accessibilityNeeds: [],
          campus: "blacksburg",
          schoolDistance: 1.5,
          gymDistance: 2.0,
          petFriendly: false,
          furnished: true,
          parking: true,
          laundry: true,
          wifi: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      if (onClose) onClose();
    } catch (error) {
      setAuthError(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed.`
      );
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <Shield size={32} color="#61dafb" />
            <h2>Proximate</h2>
          </div>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>

        <div className="auth-tabs">
          <button
            className={`tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            <LogIn size={16} />
            Sign In
          </button>
          <button
            className={`tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>

        <div className="auth-content">
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.name ? "error" : ""}
                  />
                </div>
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={errors.email ? "error" : ""}
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? "error" : ""}
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="student">Student</option>
                  <option value="tenant">Tenant</option>
                  <option value="landlord">Landlord</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="sso-buttons">
            <button
              className="sso-btn google"
              onClick={() => handleSSOLogin("google")}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              className="sso-btn microsoft"
              onClick={() => handleSSOLogin("microsoft")}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#00A4EF" d="M13 1h10v10H13z" />
                <path fill="#7FBA00" d="M1 13h10v10H1z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
              Continue with Microsoft
            </button>
          </div>

          {mode === "login" && (
            <div className="auth-footer">
              <button
                className="forgot-password-btn"
                onClick={() => setMode("forgot")}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
