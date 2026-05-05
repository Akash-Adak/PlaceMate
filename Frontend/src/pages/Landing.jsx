import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import AboutSection from "../components/sections/AboutSection";
import FooterSection from "../components/sections/FooterSection";
import { useTheme } from "../context/ThemeContext";

const Landing = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-dark-bg text-slate-200' 
        : 'bg-white text-gray-900'
    }`}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Landing;
