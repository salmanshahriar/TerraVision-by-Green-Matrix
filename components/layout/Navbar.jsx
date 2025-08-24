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
          <div className="w-6 h-6 bg-blue-600 rounded-lg border-blue-400/20 border-2 flex items-center justify-center mr-2 shadow-lg">
            <div className="w-4 h-4 ">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2
            className={`font-bold text-lg bg-clip-text text-transparent ${
              pathname === "/about" ? "bg-black" : "bg-white"
            }`}
          >
            TerraVision
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
