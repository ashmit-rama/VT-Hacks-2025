import React from "react";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "glow" | "gradient";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  glowColor?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
  icon,
  glowColor,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: "#861F41",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          glowColor: "#861F41",
        };
      case "secondary":
        return {
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "white",
          glowColor: "#ffffff",
        };
      case "glow":
        return {
          background: "rgba(0, 0, 0, 0.2)",
          border: "1px solid #ff6b6b",
          color: "#ff6b6b",
          glowColor: "#ff6b6b",
        };
      case "gradient":
        return {
          background: "#861F41",
          border: "none",
          color: "white",
          glowColor: "#861F41",
        };
      default:
        return {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          glowColor: "#667eea",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { padding: "8px 16px", fontSize: "14px", borderRadius: "12px" };
      case "medium":
        return { padding: "12px 24px", fontSize: "16px", borderRadius: "16px" };
      case "large":
        return { padding: "16px 32px", fontSize: "18px", borderRadius: "20px" };
      default:
        return { padding: "12px 24px", fontSize: "16px", borderRadius: "16px" };
    }
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <motion.button
      className={`animated-button ${variant} ${size} ${className}`}
      style={
        {
          ...styles,
          ...sizeStyles,
          "--glow-color": glowColor || styles.glowColor,
        } as React.CSSProperties
      }
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={
        !disabled
          ? {
              scale: 1.05,
              boxShadow: `0 0 30px ${styles.glowColor}40`,
              transition: { duration: 0.2 },
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="button-content">
        {icon && <span className="button-icon">{icon}</span>}
        <span className="button-text">{children}</span>
      </div>
      <div className="button-glow" />
    </motion.button>
  );
};

export default AnimatedButton;
