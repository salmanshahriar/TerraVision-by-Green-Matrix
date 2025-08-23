"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (path) => {
    router.push(path);
  };

  const baseTextColor = pathname === "/about" ? "text-black" : "text-white";

  return (
    <nav className="absolute w-full backdrop-blur-md border-b border-white/5 shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-1 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-600 rounded-lg border border-white/10 flex items-center justify-center mr-2 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
          </div>
          <h2
            className={`font-bold text-lg bg-clip-text text-transparent ${
              pathname === "/about" ? "bg-black" : "bg-white"
            }`}
          >
            EarthPulse
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 px-2 justify-between">
          {/* Home */}
          <button
            onClick={() => handleLinkClick("/")}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/"
                ? "bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 rounded-md flex items-center justify-center border-t-2 border-l-2 border-blue-400 border-r border-b border-r-blue-800/60 border-b-blue-800/60 shadow-lg hover:shadow-xl"
                : `${baseTextColor} border-t-2 border-l-2 border-r border-b border-transparent`
            }`}
          >
            Home
          </button>

          {/* About */}
          <button
            onClick={() => handleLinkClick("/about")}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/about"
                ? "bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 rounded-md flex items-center justify-center border-t-2 border-l-2 border-blue-400 border-r border-b border-r-blue-800/60 border-b-blue-800/60 shadow-lg hover:shadow-xl"
                : `${baseTextColor} border-t-2 border-l-2 border-r border-b border-transparent`
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
