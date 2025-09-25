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

const SatelliteImagery = ({ open, setOpen, dateRange }) => {
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

  useEffect(() => {
    if (open && currentStep === "loading") {
      const timer = setTimeout(() => {
        setCurrentStep("images");
      }, 3500);
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
    }, 4000);
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
      <DialogContent className="w-full max-w-7xl overflow-y-auto mx-auto gap-0 p-0 bg-white rounded-xl shadow-xl border">
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
            <div className="flex items-center justify-center h-[580px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
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
                  const c = colorMap[period.color]; // ✅ Get pre-defined Tailwind classes
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