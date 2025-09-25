
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

const SatelliteImagery = ({ open, setOpen, dateRange }) => {
  const [currentStep, setCurrentStep] = useState('loading');
  const [loadingText, setLoadingText] = useState('Finding satellite images...');

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
    "/images/Highway_1061.jpg"
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
    "/images/River_1008.jpg"
  ];

  const coverageStartData = [
    { name: 'Forest', value: 31, color: '#10b981' },
    { name: 'Barren', value: 21, color: '#f97316' },
    { name: 'Urban', value: 30, color: '#ef4444' }
  ];

  const coverageEndData = [
    { name: 'Forest', value: 24, color: '#10b981' },
    { name: 'Barren', value: 25, color: '#f97316' },
    { name: 'Urban', value: 35, color: '#ef4444' }
  ];

  const fullTimelineData = [
    { year: '2015', forest: 45, barren: 8, urban: 15 },
    { year: '2016', forest: 43, barren: 10, urban: 17 },
    { year: '2017', forest: 41, barren: 12, urban: 19 },
    { year: '2018', forest: 39, barren: 14, urban: 21 },
    { year: '2019', forest: 37, barren: 15, urban: 23 },
    { year: '2020', forest: 35, barren: 17, urban: 26 },
    { year: '2021', forest: 33, barren: 19, urban: 28 },
    { year: '2022', forest: 31, barren: 21, urban: 30 },
    { year: '2023', forest: 29, barren: 23, urban: 32 },
    { year: '2024', forest: 27, barren: 25, urban: 34 },
    { year: '2025', forest: 24, barren: 27, urban: 36 },
    { year: '2026', forest: 22, barren: 28, urban: 38 }
  ];

  const classData = [
    { name: 'AnnualCrop', value: 5 },
    { name: 'Forest', value: 6 },
    { name: 'HerbaceousVegetation', value: 4 },
    { name: 'Highway', value: 6 },
    { name: 'Industrial', value: 0 },
    { name: 'Pasture', value: 0 },
    { name: 'PermanentCrop', value: 0 },
    { name: 'Residential', value: 0 },
    { name: 'River', value: 3 },
    { name: 'SeaLake', value: 0 }
  ];

  const getYearFromDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const startYear = dateRange?.from ? getYearFromDate(dateRange.from) : '2022';
  const endYear = dateRange?.to ? getYearFromDate(dateRange.to) : '2025';

  const getTimelineData = () => {
    const start = parseInt(startYear);
    const end = parseInt(endYear);
    return fullTimelineData.filter(row => parseInt(row.year) >= start && parseInt(row.year) <= end);
  };

  const timelineData = getTimelineData();

  const getChangeSummary = () => {
    const startData = timelineData.find(row => row.year === startYear);
    const endData = timelineData.find(row => row.year === endYear);

    if (!startData || !endData) {
      return [
        { metric: 'Forest Coverage', [`value${startYear}`]: 'N/A', [`value${endYear}`]: 'N/A', change: 'N/A' },
        { metric: 'NDVI Average', [`value${startYear}`]: 'N/A', [`value${endYear}`]: 'N/A', change: 'N/A' },
        { metric: 'Urban Coverage', [`value${startYear}`]: 'N/A', [`value${endYear}`]: 'N/A', change: 'N/A' },
        { metric: 'Barren Land', [`value${startYear}`]: 'N/A', [`value${endYear}`]: 'N/A', change: 'N/A' }
      ];
    }

    const forestChange = ((endData.forest - startData.forest) / startData.forest * 100).toFixed(1);
    const urbanChange = ((endData.urban - startData.urban) / startData.urban * 100).toFixed(1);
    const barrenChange = ((endData.barren - startData.barren) / startData.barren * 100).toFixed(1);
    const ndviStart = 0.65; // Hardcoded for simplicity; ideally, fetch from data source
    const ndviEnd = 0.5;   // Hardcoded for simplicity; ideally, fetch from data source
    const ndviChange = (ndviEnd - ndviStart).toFixed(2);

    return [
      { metric: 'Forest Coverage', [`value${startYear}`]: `${startData.forest}%`, [`value${endYear}`]: `${endData.forest}%`, change: `${forestChange}%` },
      { metric: 'NDVI Average', [`value${startYear}`]: ndviStart.toFixed(2), [`value${endYear}`]: ndviEnd.toFixed(2), change: ndviChange },
      { metric: 'Urban Coverage', [`value${startYear}`]: `${startData.urban}%`, [`value${endYear}`]: `${endData.urban}%`, change: `+${urbanChange}%` },
      { metric: 'Barren Land', [`value${startYear}`]: `${startData.barren}%`, [`value${endYear}`]: `${endData.barren}%`, change: `+${barrenChange}%` }
    ];
  };

  const changeSummary = getChangeSummary();

  useEffect(() => {
    if (open && currentStep === 'loading') {
      const timer = setTimeout(() => {
        setCurrentStep('images');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [open, currentStep]);

  const handleCompareData = () => {
    setCurrentStep('analyzing');
    setLoadingText('Analyzing satellite images with machine learning...');
    
    setTimeout(() => {
      setCurrentStep('results');
    }, 4000);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setCurrentStep('loading');
      setLoadingText('Finding Sentinel-2 satellite images from Earth Engine...');
    }, 300);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const getFormattedDates = () => {
    if (dateRange && dateRange.from && dateRange.to) {
      return {
        from: formatDate(dateRange.from),
        to: formatDate(dateRange.to)
      };
    }

    const today = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(today.getFullYear() - 3);
    return {
      from: pastDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    };
  };

  const dates = getFormattedDates();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-7xl overflow-y-auto mx-auto gap-0 p-0 bg-white rounded-xl shadow-xl border-t-4 border-l-4 border-white border-r border-b border-r-gray-300/60 border-b-gray-300/60">
        <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none"></div>
        {/* Header */}
        <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Deforestation Analysis
                </DialogTitle>
                <DialogDescription className="text-blue-100 text-sm mt-1">
                  {dates.from} to {dates.to} • Remote Sensing Data
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 bg-gray-50/50 backdrop-blur-sm">
          {/* Loading State */}
          {currentStep === 'loading' && (
            <div className="flex items-center justify-center h-[580px]">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">{loadingText}</p>
                <p className="text-sm text-gray-500">Accessing satellite databases...</p>
              </div>
            </div>
          )}

          {/* Images Display */}
          {currentStep === 'images' && (
            <div className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Section 1 - Start Date Images */}
                <div className="bg-white p-3 rounded-xl shadow-sm border">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="text-xs font-semibold text-black">Satellite Images ({dates.from})</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {section1Images.map((src, index) => (
                        <div key={index} className="cursor-pointer">
                          <img
                            src={src}
                            alt={`Historical satellite image ${index + 1}`}
                            className="w-full h-24 object-cover rounded shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2 - End Date Images */}
                <div className="bg-white p-3 rounded-xl shadow-sm border">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <h3 className="text-xs font-semibold text-black">Satellite Images ({dates.to})</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {section2Images.map((src, index) => (
                        <div key={index} className="cursor-pointer">
                          <img
                            src={src}
                            alt={`Recent satellite image ${index + 1}`}
                            className="w-full h-24 object-cover rounded shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compare Data Button */}
              <div className="flex justify-center pt-1">
                <button
                  onClick={handleCompareData}
                  className="bg-black text-white font-medium py-1.5 px-4 rounded-lg text-xs shadow-md flex items-center justify-center space-x-2 relative"
                >
                  <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none"></div>
                  <span className="relative z-10">Analyze & Compare Data</span>
                </button>
              </div>
            </div>
          )}

          {/* Analyzing State */}
          {currentStep === 'analyzing' && (
            <div className="flex items-center justify-center h-[580px]">
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src="/loading.gif" 
                    alt="Loading animation"
                    className="w-96 h-96 rounded-lg mx-auto shadow-lg"
                  />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">{loadingText}</p>
                <p className="text-sm text-gray-500">Processing NDVI and change detection...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {currentStep === 'results' && (
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