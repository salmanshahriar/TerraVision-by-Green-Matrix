import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';

const SatelliteImagery = ({ open, setOpen, dateRange }) => {
  const [currentStep, setCurrentStep] = useState('loading');
  const [loadingText, setLoadingText] = useState('Finding satellite images...');

  const section1Images = [
    "/images/AnnualCrop_1054.jpg",
    "/images/AnnualCrop_1143.jpg",
    "/images/AnnualCrop_1184.jpg",
    "/images/Forest_1.jpg",
    "/images/Forest_1056.jpg",
    "/images/Forest_1135.jpg",
    "/images/HerbaceousVegetation_1044.jpg",
    "/images/HerbaceousVegetation_1090.jpg",
    "/images/Highway_1061.jpg"
  ];

  const section2Images = [
    "/images/Highway_1064.jpg",
    "/images/Highway_1075.jpg",
    "/images/River_1008.jpg",
    "/images/Forest_1056.jpg",
    "/images/AnnualCrop_1054.jpg",
    "/images/Forest_1135.jpg",
    "/images/HerbaceousVegetation_1044.jpg",
    "/images/Highway_1061.jpg",
    "/images/River_1008.jpg"
  ];

  // Chart data for the start date
  const coverageStartData = [
    { name: 'Forest', value: 68, color: '#10b981' },
    { name: 'Barren', value: 20, color: '#f97316' },
    { name: 'Urban', value: 12, color: '#ef4444' }
  ];

  // Chart data for the end date
  const coverageEndData = [
    { name: 'Forest', value: 58, color: '#10b981' },
    { name: 'Barren', value: 26, color: '#f97316' },
    { name: 'Urban', value: 16, color: '#ef4444' }
  ];

  const timelineData = [
    { year: '2020', forest: 68, barren: 20, urban: 12 },
    { year: '2021', forest: 64, barren: 22, urban: 14 },
    { year: '2022', forest: 62, barren: 23, urban: 15 },
    { year: '2023', forest: 60, barren: 25, urban: 15 },
    { year: '2024', forest: 58, barren: 26, urban: 16 }
  ];

  useEffect(() => {
    if (open && currentStep === 'loading') {
      const timer = setTimeout(() => {
        setCurrentStep('images');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, currentStep]);

  const handleCompareData = () => {
    setCurrentStep('analyzing');
    setLoadingText('Analyzing satellite data with AI...');
    
    setTimeout(() => {
      setCurrentStep('results');
    }, 4000);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setCurrentStep('loading');
      setLoadingText('Finding satellite images...');
    }, 300);
  };

  // Format date from YYYY-MM-DD to MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  // Get formatted dates from props or use defaults
  const getFormattedDates = () => {
    if (dateRange && dateRange.from && dateRange.to) {
      return {
        from: formatDate(dateRange.from),
        to: formatDate(dateRange.to)
      };
    }
    // Fallback to default dates if no dateRange provided
    const today = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(today.getFullYear() - 4);
    return {
      from: pastDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    };
  };

  const dates = getFormattedDates();

  // Get year from date string for dynamic labeling
  const getYearFromDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const startYear = dateRange?.from ? getYearFromDate(dateRange.from) : '2021';
  const endYear = dateRange?.to ? getYearFromDate(dateRange.to) : '2025';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full p-0 overflow-y-auto border border-white gap-0 mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold">
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
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {/* Loading State */}
          {currentStep === 'loading' && (
            <div className="flex items-center justify-center h-80">
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
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-sm font-semibold">Satellite Images ({dates.from})</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {section1Images.map((src, index) => (
                      <div key={index} className="cursor-pointer">
                        <img
                          src={src}
                          alt={`Historical satellite image ${index + 1}`}
                          className="w-full h-24 object-cover rounded shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2 - End Date Images */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <h3 className="text-sm font-semibold">Satellite Images ({dates.to})</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {section2Images.map((src, index) => (
                      <div key={index} className="cursor-pointer">
                        <img
                          src={src}
                          alt={`Recent satellite image ${index + 1}`}
                          className="w-full h-24 object-cover rounded shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compare Data Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleCompareData}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Analyze & Compare Data
                </button>
              </div>
            </div>
          )}

          {/* Analyzing State */}
          {currentStep === 'analyzing' && (
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src="/loading.gif" 
                    alt="Loading animation"
                    className="w-64 h-64 rounded-lg mx-auto shadow-lg"
                  />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">{loadingText}</p>
                <p className="text-sm text-gray-500">Processing NDVI and change detection...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {currentStep === 'results' && (
            <div className="space-y-4">
              {/* Key Findings */}
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-xs">Forest Loss</p>
                      <p className="text-2xl font-bold">-40%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs">NDVI Decline</p>
                      <p className="text-2xl font-bold">0.7→0.5</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs">Analysis Period</p>
                      <p className="text-xl font-bold">{endYear - startYear} Years</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-base font-semibold mb-2">
                  Analysis Summary
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Analysis of Chittagong, Bangladesh from {dates.from} to {dates.to} reveals significant deforestation primarily driven by agricultural expansion, urbanization, and illegal logging. Studies suggest deforestation rates have been substantial, with some areas experiencing forest cover loss exceeding <strong className="text-red-600">40%</strong> during this period. This contributes to habitat loss, soil erosion, and increased vulnerability to natural disasters.
                </p>
              </div>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Start Date Coverage Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold">{startYear} - Area Coverage</h3>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={coverageStartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                          {coverageStartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Land coverage distribution in {startYear}
                  </p>
                </div>

                {/* End Date Coverage Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold">{endYear} - Area Coverage</h3>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={coverageEndData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                          {coverageEndData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Land coverage distribution in {endYear}
                  </p>
                </div>

                {/* Timeline Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold">{endYear - startYear + 1}-Year Trend</h3>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Line 
                          type="monotone" 
                          dataKey="forest" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                          name="Forest"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="barren" 
                          stroke="#f97316" 
                          strokeWidth={2}
                          dot={{ fill: '#f97316', strokeWidth: 1, r: 2 }}
                          name="Barren"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="urban" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ fill: '#ef4444', strokeWidth: 1, r: 2 }}
                          name="Urban"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Land cover change ({startYear}-{endYear})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SatelliteImagery;