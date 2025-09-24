"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (path) => {
    router.push(path);
  };

  return (
    <nav className="absolute w-full backdrop-blur-md border-b border-white/5 shadow-md z-10">
      <div className="flex items-center justify-between px-6 py-2 mx-auto">
        {/* Logo */}
        <div className="bg-white rounded-lg px-2 py-1 relative transition-all duration-200">
          <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="w-5 h-5 bg-blue-600 rounded-md border-blue-400/20 border flex items-center justify-center mr-2 shadow-md">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-bold text-base text-black">
              TerraVision
            </h2>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-lg px-1 py-0.5 relative transition-all duration-200 ">
          <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
          <div className="flex items-center gap-0.5 relative z-10">
            {/* Home */}
            <button
              onClick={() => handleLinkClick("/")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 relative ${
                pathname === "/"
                  ? "bg-blue-600 text-white "
                  : "text-black hover:bg-gray-50"
              }`}
            >
              <span className="relative z-10">Home</span>
            </button>

            {/* About */}
            <button
              onClick={() => handleLinkClick("/about")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 relative ${
                pathname === "/about"
                  ? "bg-blue-600 text-white"
                  : "text-black hover:bg-gray-50"
              }`}
            >
              <span className="relative z-10">About</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;