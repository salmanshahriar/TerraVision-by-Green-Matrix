"use client";

import React, { useState } from "react";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  return (
    <nav className="absolute w-full backdrop-blur-md border-b border-white/5 shadow-sm z-10 ">
      <div className="flex items-center justify-between px-6 py-1 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-600 rounded-lg border border-white/10 flex items-center justify-center mr-2 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
          </div>
          <h2 className="font-bold text-lg bg-white bg-clip-text text-transparent">
            EarthPulse
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 px-2 justify-between">
          <button
            onClick={() => handleLinkClick("Home")}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeLink === "Home"
                ? "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-center space-x-2 border-t-2 border-l-2 border-blue-400 border-r border-b border-r-blue-800/60 border-b-blue-800/60 shadow-lg hover:shadow-xl relative"
                : "text-white "
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleLinkClick("About")}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeLink === "About"
                ? "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-center space-x-2 border-t-2 border-l-2 border-blue-400 border-r border-b border-r-blue-800/60 border-b-blue-800/60 shadow-lg hover:shadow-xl relative"
                : "text-white "
            }`}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;