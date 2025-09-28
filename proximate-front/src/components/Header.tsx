import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { User as UserType } from "../types";
import "./Header.css";

interface HeaderProps {
  title?: string;
  isAuthenticated?: boolean;
  user?: UserType | null;
  onAuthClick?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "Proximate",
  isAuthenticated = false,
  user,
  onAuthClick,
  onLogout,
}) => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1 className="header-title">{title}</h1>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/discover" className="nav-link">
            Discover
          </Link>
          <Link to="/collections" className="nav-link">
            Collections
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="nav-link user-link">
                <User size={16} />
                {user?.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : "Profile"}
              </Link>
              <button className="logout-btn" onClick={onLogout} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="auth-btn" onClick={onAuthClick}>
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
