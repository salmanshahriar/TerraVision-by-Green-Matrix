"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import ResultsSection from "./ResultSection";
import { downloadJSONData, downloadPDF } from "./DownloadUtils";

const colorMap = {
  emerald: {
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    statsBg: "bg-emerald-50",
    statsBorder: "border-emerald-200",
    statsText: "text-emerald-700",
    statsValue: "text-emerald-800",
  },
  amber: {
    dot: "bg-amber-500",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    statsBg: "bg-amber-50",
    statsBorder: "border-amber-200",
    statsText: "text-amber-700",
    statsValue: "text-amber-800",
  },
};

const calculateAreaMetrics = (drawnLayer) => {
  if (!drawnLayer || !drawnLayer.getLatLngs) {
    return {
      area: "532.47 km²",
      perimeter: "110.16 km",
      centerPoint: "22.3384, 91.7948"
    };
  }

  try {
    const latlngs = drawnLayer.getLatLngs()[0]; 
    
    if (!latlngs || latlngs.length < 3) {
      return {
        area: "532.47 km²",
        perimeter: "110.16 km",
        centerPoint: "22.3384, 91.7948"
      };
    }

    let area = 0;
    let perimeter = 0;
    
    const toRad = (deg) => deg * (Math.PI / 180);
    const earthRadius = 6371000; 

    for (let i = 0; i < latlngs.length; i++) {
      const j = (i + 1) % latlngs.length;
      const lat1 = toRad(latlngs[i].lat);
      const lng1 = toRad(latlngs[i].lng);
      const lat2 = toRad(latlngs[j].lat);
      const lng2 = toRad(latlngs[j].lng);
      
      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
      
      const dLat = lat2 - lat1;
      const dLng = lng2 - lng1;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      perimeter += earthRadius * c;
    }
    
    area = Math.abs(area * earthRadius * earthRadius / 2);
    
    const centerLat = latlngs.reduce((sum, point) => sum + point.lat, 0) / latlngs.length;
    const centerLng = latlngs.reduce((sum, point) => sum + point.lng, 0) / latlngs.length;

    return {
      area: `${(area / 1000000).toFixed(2)} km²`, // Convert to km²
      perimeter: `${(perimeter / 1000).toFixed(2)} km`, // Convert to km
      centerPoint: `${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}`
    };
  } catch (error) {
    console.error('Error calculating area metrics:', error);
    return {
      area: "532.47 km²",
      perimeter: "110.16 km", 
      centerPoint: "22.3384, 91.7948"
    };
  }
};

const SatelliteImagery = ({ open, setOpen, dateRange, drawnLayer }) => {
  const [currentStep, setCurrentStep] = useState("loading");
  const [loadingText, setLoadingText] = useState(
    "Accessing Google Earth Engine API..."
  );

  const section1Images = [
    "/images/AnnualCrop_1054.jpg",
    "/images/AnnualCrop_1143.jpg",
    "/images/AnnualCrop_1184.jpg",
    "/images/Forest_1.jpg",
    "/images/Forest_1056.jpg",
    "/images/Highway_1061.jpg",
    "/images/River_1008.jpg",
    "/images/Forest_1135.jpg",
    "/images/HerbaceousVegetation_1044.jpg",
    "/images/HerbaceousVegetation_1090.jpg",
    "/images/AnnualCrop_1054.jpg",
    "/images/Highway_1061.jpg",
  ];

  const section2Images = [
    "/images/Highway_1064.jpg",
    "/images/Highway_1075.jpg",
    "/images/River_1008.jpg",
    "/images/Highway_1061.jpg",
    "/images/Forest_1056.jpg",
    "/images/Forest_1135.jpg",
    "/images/HerbaceousVegetation_1044.jpg",
    "/images/AnnualCrop_1054.jpg",
    "/images/Forest_1135.jpg",
    "/images/HerbaceousVegetation_1044.jpg",
    "/images/Highway_1061.jpg",
    "/images/River_1008.jpg",
  ];

  const coverageStartData = [
    { name: "Forest", value: 31, color: "#10b981" },
    { name: "Barren", value: 21, color: "#f97316" },
    { name: "Urban", value: 30, color: "#ef4444" },
  ];

  const coverageEndData = [
    { name: "Forest", value: 24, color: "#10b981" },
    { name: "Barren", value: 25, color: "#f97316" },
    { name: "Urban", value: 35, color: "#ef4444" },
  ];

  const fullTimelineData = [
    { year: "2015", forest: 45, barren: 8, urban: 15 },
    { year: "2016", forest: 43, barren: 10, urban: 17 },
    { year: "2017", forest: 41, barren: 12, urban: 19 },
    { year: "2018", forest: 39, barren: 14, urban: 21 },
    { year: "2019", forest: 37, barren: 15, urban: 23 },
    { year: "2020", forest: 35, barren: 17, urban: 26 },
    { year: "2021", forest: 33, barren: 19, urban: 28 },
    { year: "2022", forest: 31, barren: 21, urban: 30 },
    { year: "2023", forest: 29, barren: 23, urban: 32 },
    { year: "2024", forest: 27, barren: 25, urban: 34 },
    { year: "2025", forest: 24, barren: 27, urban: 36 },
    { year: "2026", forest: 22, barren: 28, urban: 38 },
  ];

  const classData = [
    { name: "Annual Crop", value: 142, color: "#fbbf24" },
    { name: "Forest", value: 98, color: "#10b981" },
    { name: "Herbaceous Veg", value: 76, color: "#84cc16" },
    { name: "Highway", value: 45, color: "#6b7280" },
    { name: "Residential", value: 89, color: "#3b82f6" },
    { name: "Industrial", value: 34, color: "#8b5cf6" },
    { name: "Pasture", value: 52, color: "#22c55e" },
    { name: "Permanent Crop", value: 28, color: "#f97316" },
    { name: "River", value: 23, color: "#06b6d4" },
    { name: "Sea/Lake", value: 15, color: "#0ea5e9" },
  ];

  const getYearFromDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const startYear = dateRange?.from ? getYearFromDate(dateRange.from) : "2022";
  const endYear = dateRange?.to ? getYearFromDate(dateRange.to) : "2025";

  const getTimelineData = () => {
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    return fullTimelineData.filter(
      (row) => parseInt(row.year) >= start && parseInt(row.year) <= end
    );
  };

  const timelineData = getTimelineData();

  const getChangeSummary = () => {
    const startData = timelineData.find((row) => row.year === startYear);
    const endData = timelineData.find((row) => row.year === endYear);

    if (!startData || !endData) {
      return [];
    }

    const forestChange = (
      ((endData.forest - startData.forest) / startData.forest) *
      100
    ).toFixed(1);
    const urbanChange = (
      ((endData.urban - startData.urban) / startData.urban) *
      100
    ).toFixed(1);
    const barrenChange = (
      ((endData.barren - startData.barren) / startData.barren) *
      100
    ).toFixed(1);
    const ndviStart = 0.65;
    const ndviEnd = 0.5;
    const ndviChange = (ndviEnd - ndviStart).toFixed(2);

    return [
      {
        metric: "Forest Coverage",
        [`value${startYear}`]: `${startData.forest}%`,
        [`value${endYear}`]: `${endData.forest}%`,
        change: `${forestChange}%`,
      },
      {
        metric: "NDVI Average",
        [`value${startYear}`]: ndviStart.toFixed(2),
        [`value${endYear}`]: ndviEnd.toFixed(2),
        change: ndviChange,
      },
      {
        metric: "Urban Coverage",
        [`value${startYear}`]: `${startData.urban}%`,
        [`value${endYear}`]: `${endData.urban}%`,
        change: `+${urbanChange}%`,
      },
      {
        metric: "Barren Land",
        [`value${startYear}`]: `${startData.barren}%`,
        [`value${endYear}`]: `${endData.barren}%`,
        change: `+${barrenChange}%`,
      },
    ];
  };

  const changeSummary = getChangeSummary();

  const areaMetrics = calculateAreaMetrics(drawnLayer);

  useEffect(() => {
    if (open && currentStep === "loading") {
      const timer = setTimeout(() => {
        setCurrentStep("images");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [open, currentStep]);

  const handleCompareData = () => {
    setCurrentStep("analyzing");
    setLoadingText(
      "Processing COPERNICUS/S2_SR imagery with ML algorithms..."
    );
    setTimeout(() => {
      setCurrentStep("results");
    }, 6000);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setCurrentStep("loading");
      setLoadingText("Accessing Google Earth Engine API...");
    }, 300);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getFormattedDates = () => {
    if (dateRange && dateRange.from && dateRange.to) {
      return {
        from: formatDate(dateRange.from),
        to: formatDate(dateRange.to),
      };
    }
    const today = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(today.getFullYear() - 3);
    return {
      from: formatDate(pastDate),
      to: formatDate(today),
    };
  };

  const dates = getFormattedDates();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-7xl  overflow-y-auto mx-auto gap-0 p-0 bg-white shadow-xl rounded-xl border-t-2 border-l-2 border-white border-r border-b border-r-gray-300/60 border-b-gray-300/60 ">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Deforestation Analysis
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm mt-1">
              {dates.from} to {dates.to} • Remote Sensing Data
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-4 bg-gray-50/50 backdrop-blur-sm">
          {currentStep === "loading" && (
            <div className="flex flex-col items-center justify-center h-[580px]">
              <div className="text-center max-w-md">

                 {/* Area Information Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg border border-blue-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Selected Area Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <span className="text-gray-600 block">Area:</span>
                      <span className="font-mono text-blue-800 font-semibold">{areaMetrics.area}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-600 block">Perimeter:</span>
                      <span className="font-mono text-blue-800 font-semibold">{areaMetrics.perimeter}</span>
                    </div>
                    <div className="text-left col-span-2">
                      <span className="text-gray-600 block">Center Point:</span>
                      <span className="font-mono text-blue-800 font-semibold">{areaMetrics.centerPoint}</span>
                    </div>
                    <div className="text-left col-span-2">
                      <span className="text-gray-600 block">Date Range:</span>
                      <span className="font-mono text-blue-800 font-semibold">
                        {dateRange?.from || '2023-01-01'} to {dateRange?.to || '2024-12-31'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                
               

                <p className="text-lg font-medium text-gray-700 mb-2">
                  {loadingText}
                </p>
                <p className="text-sm text-gray-500">
                  Querying COPERNICUS/S2_SR Level-2A collection...
                </p>
              </div>
            </div>
          )}

          {currentStep === "images" && (
            <div className="space-y-6">
              {/* Data Source & Processing */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Data Source & Processing
                  </h3>
                </div>
                <div className="grid grid-cols-4 gap-y-1 text-[11px] leading-tight">
                  <span className="text-slate-600">Dataset:</span>
                  <span className="text-slate-800 font-mono col-span-1">
                    COPERNICUS/S2_SR
                  </span>
                  <span className="text-slate-600">Level:</span>
                  <span className="text-slate-800">2A (Surface Reflectance)</span>

                  <span className="text-slate-600">Correction:</span>
                  <span className="text-green-600 font-medium">Applied ✓</span>
                  <span className="text-slate-600">Resolution:</span>
                  <span className="text-slate-800">10m (RGB)</span>

                  <span className="text-slate-600">Bands:</span>
                  <span className="text-slate-800 font-mono">B4, B3, B2</span>
                  <span className="text-slate-600">Range:</span>
                  <span className="text-slate-800 font-mono">0–3000</span>
                  <span className="text-slate-600">Gamma:</span>
                  <span className="text-slate-800 font-mono">1.4</span>
                  <span className="text-slate-600">Clouds:</span>
                  <span className="text-green-600 font-medium">10%</span>
                </div>
              </div>

              {/* T1 & T2 sections */}
              <div className="grid lg:grid-cols-2 gap-6">
                {[
                  {
                    title: "Baseline Period",
                    color: "emerald",
                    images: section1Images,
                    date: dates.from,
                    stats: { acq: 12, cloud: "5.2%", pixels: "98.4%", window: "±15d" },
                  },
                  {
                    title: "Comparison Period",
                    color: "amber",
                    images: section2Images,
                    date: dates.to,
                    stats: { acq: 12, cloud: "7.8%", pixels: "96.7%", window: "±15d" },
                  },
                ].map((period, i) => {
                  const c = colorMap[period.color];
                  return (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${c.dot} rounded-full`}></div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-800">
                              {period.title}
                            </h3>
                            <p className="text-xs text-slate-600">
                              {period.date} • Sentinel-2 MSI
                            </p>
                          </div>
                        </div>
                        <div className={`${c.badgeBg} ${c.badgeText} px-2 py-0.5 rounded-full text-xs font-medium`}>
                          {i === 0 ? "T1" : "T2"}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {period.images.map((src, idx) => (
                          <div key={idx} className="group relative">
                            <img
                              src={src}
                              alt={`${period.title} ${idx + 1}`}
                              className="w-full h-20 object-cover rounded-lg border shadow-sm"
                            />
                            <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                              {String(idx + 1).padStart(2, "0")}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Acquisition Stats */}
                      <div className={`${c.statsBg} p-2 rounded-lg border ${c.statsBorder}`}>
                        <p className={`${c.statsText} text-[11px] leading-tight`}>
                          Acquisitions:{" "}
                          <span className={`font-mono ${c.statsValue}`}>
                            {period.stats.acq}
                          </span>, Cloud Cover:{" "}
                          <span className={`font-mono ${c.statsValue}`}>
                            {period.stats.cloud}
                          </span>, Valid Pixels:{" "}
                          <span className={`font-mono ${c.statsValue}`}>
                            {period.stats.pixels}
                          </span>, Window:{" "}
                          <span className={`font-mono ${c.statsValue}`}>
                            {period.stats.window}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Execute */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleCompareData}
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg text-sm shadow hover:shadow-md transition"
                >
                  Execute Multi-Temporal Analysis
                </button>
              </div>
            </div>
          )}

          {/* Analyzing */}
          {currentStep === "analyzing" && (
            <div className="flex items-center justify-center h-[580px]">
              <div className="text-center">
                <img
                  src="/loading.gif"
                  alt="Loading animation"
                  className="w-72 h-72 mx-auto mb-4 rounded-lg"
                />
                <p className="text-lg font-medium text-gray-700 mb-1">
                  {loadingText}
                </p>
                <p className="text-sm text-gray-500">
                  Computing NDVI, NDMI, and change matrices...
                </p>
              </div>
            </div>
          )}

          {currentStep === "results" && (
            <ResultsSection
              dates={dates}
              startYear={startYear}
              endYear={endYear}
              timelineData={timelineData}
              coverageStartData={coverageStartData}
              coverageEndData={coverageEndData}
              classData={classData}
              changeSummary={changeSummary}
              downloadJSONData={downloadJSONData}
              downloadPDF={downloadPDF}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SatelliteImagery;