import React from "react";
import { motion } from "framer-motion";
import "./AnimatedCard.css";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
  delay?: number;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  hoverScale = 1.05,
  glowColor = "#667eea",
  delay = 0,
  onClick,
}) => {
  return (
    <motion.div
      className={`animated-card ${className}`}
      style={{ "--glow-color": glowColor } as React.CSSProperties}
      onClick={onClick}
      initial={{
        opacity: 0,
        y: 50,
        scale: 0.9,
        rotateX: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: hoverScale,
        rotateY: 5,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="card-glow" />
      <div className="card-content">{children}</div>
    </motion.div>
  );
};

export default AnimatedCard;
