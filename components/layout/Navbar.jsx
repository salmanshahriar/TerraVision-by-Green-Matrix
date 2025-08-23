"use client";

import React, { useState } from "react";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  return (
    <nav className="absolute w-full backdrop-blur-md shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-1 mx-auto">
        {/* Logo */}
        <div className="flex items-center ">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-2 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
          </div>
          <h2 className="font-bold text-lg bg-white bg-clip-text text-transparent">
            EarthPulse
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleLinkClick("Home")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${
              activeLink === "Home"
                ? "bg-white text-black shadow-sm"
                : "text-white "
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleLinkClick("About")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${
              activeLink === "About"
                ? "bg-white text-black shadow-sm"
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