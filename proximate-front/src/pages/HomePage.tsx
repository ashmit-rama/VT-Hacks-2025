import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Users,
  Mic,
  MapPin,
  Shield,
  ArrowRight,
} from "lucide-react";
import AnimatedButton from "../components/AnimatedButton/AnimatedButton";
import "./HomePage.css";

// Animation variants
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <motion.div
          className="hero-content"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={heroItemVariants}>
            Find Your Perfect Home Near Campus
          </motion.h1>
          <motion.p className="hero-subtitle" variants={heroItemVariants}>
            AI-driven housing discovery that matches your lifestyle, commute
            preferences, and daily routines in Blacksburg and beyond.
          </motion.p>
          <motion.div className="hero-actions" variants={heroItemVariants}>
            <AnimatedButton
              variant="gradient"
              size="large"
              icon={<ArrowRight size={20} />}
              className="cta-button"
            >
              <Link
                to="/discover"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Get Started
              </Link>
            </AnimatedButton>
          </motion.div>
        </motion.div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose Proximate?
          </motion.h2>
          <motion.div
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.div
              className="feature-card"
              variants={featureVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Mic size={32} color="#ffffff" />
              </motion.div>
              <h3>Voice & Translation</h3>
              <p>
                Speak your preferences in any language. Our AI extracts commute
                modes, budget, amenities, and lifestyle needs automatically.
              </p>
            </motion.div>

            <motion.div
              className="feature-card"
              variants={featureVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Search size={32} color="#ffffff" />
              </motion.div>
              <h3>Smart Discovery</h3>
              <p>
                Swipe through housing options like Tinder. Our algorithm learns
                your preferences and shows you the best matches first.
              </p>
            </motion.div>

            <motion.div
              className="feature-card"
              variants={featureVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Users size={32} color="#ffffff" />
              </motion.div>
              <h3>Community Insights</h3>
              <p>
                Read verified reviews from past tenants. See community tags and
                get real insights from people who've lived there.
              </p>
            </motion.div>

            <motion.div
              className="feature-card"
              variants={featureVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <MapPin size={32} color="#ffffff" />
              </motion.div>
              <h3>Campus-Focused</h3>
              <p>
                Search across Virginia Tech campuses with smart filters. Find
                housing that fits your academic schedule and lifestyle.
              </p>
            </motion.div>

            <motion.div
              className="feature-card"
              variants={featureVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Shield size={32} color="#ffffff" />
              </motion.div>
              <h3>Secure & Private</h3>
              <p>
                Your data is protected with enterprise-grade security. Anonymous
                options available for sensitive preferences.
              </p>
            </motion.div>

            <motion.div
              className="feature-card"
              variants={featureVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Heart size={32} color="#ffffff" />
              </motion.div>
              <h3>Share with Roommates</h3>
              <p>
                Create collections and share them with potential roommates.
                Collaborate on decisions and find your perfect living situation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="steps"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.div
              className="step"
              variants={stepVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="step-number"
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 },
                }}
              >
                1
              </motion.div>
              <div className="step-content">
                <h3>Tell Us About Yourself</h3>
                <p>
                  Speak or type your preferences - commute style, budget,
                  lifestyle needs, and more.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="step"
              variants={stepVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="step-number"
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 },
                }}
              >
                2
              </motion.div>
              <div className="step-content">
                <h3>Discover Housing</h3>
                <p>
                  Swipe through personalized housing recommendations based on
                  your preferences.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="step"
              variants={stepVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="step-number"
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 },
                }}
              >
                3
              </motion.div>
              <div className="step-content">
                <h3>Get Community Insights</h3>
                <p>
                  Read reviews from past tenants and see community tags from
                  current residents.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="step"
              variants={stepVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="step-number"
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 },
                }}
              >
                4
              </motion.div>
              <div className="step-content">
                <h3>Share & Decide</h3>
                <p>
                  Create collections, share with roommates, and make informed
                  decisions together.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
