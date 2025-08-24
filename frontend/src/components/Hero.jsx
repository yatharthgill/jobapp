import React, { useRef } from "react";
import { Link } from "react-router-dom";

import Particles from "./ui/Particles/Particles";
import GradientText from "./ui/GradientText/GradientText";
import ShinyText from "./ui/ShinyText/ShinyText";

// Main App Component - Hero Section
const HeroSection = () => {
  const contentRef = useRef(null);



  return (
    <section
      id="heroSection"
      className="relative w-full max-h-screen md:min-h-[85vh] flex items-center justify-center bg-gray-100 text-gray-800 overflow-hidden p-4"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-auto">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Gradient overlay (visual only, doesn’t block mouse) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white opacity-40 pointer-events-none"></div>

      {/* Blurry background circle (visual only) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[400px] md:h-[400px] bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none"></div>

      {/* Content Card */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center p-8 md:p-10 bg-transparent rounded-3xl shadow-2xl border border-white/30 transition-transform duration-300 ease-out glow-effect max-w-full"
      >
        {/* Headline with last word highlighted */}
        <h1 className="text-3xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 pb-4 animate-fade-in-down">
          <GradientText
            colors={["#7C3AED", "#60A5FA", "#7C3AED", "#60A5FA", "#7C3AED"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            Find Your Dream Job with the Power of AI
          </GradientText>
        </h1>

        {/* Subheading */}
        <div
          className="mt-4 text-base md:text-xl text-gray-900 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          
          <ShinyText
            text="Our intelligent platform helps you discover the perfect job and
          optimize your resume to stand out from the crowd."
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </div>

        {/* CTA Buttons */}
        <div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            to="/jobs"
            className="group relative inline-flex items-center justify-center px-8 py-2 md:py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-indigo-500/50"
          >
            <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <span className="relative flex items-center">🔍 Find a Job</span>
          </Link>

          <Link
            to="/resume"
            className="group relative inline-flex items-center justify-center px-8 py-2 md:py-4 text-lg font-semibold text-gray-900 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-purple-400/40"
          >
            <span className="relative flex items-center">
              ✨ Analyze Resume
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
