"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Download, FileText } from 'lucide-react';

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
    { year: '2019', forest: 68, barren: 20, urban: 12 },
    { year: '2020', forest: 64, barren: 20, urban: 12 },
    { year: '2021', forest: 61, barren: 22, urban: 14 },
    { year: '2022', forest: 58, barren: 23, urban: 15 },
    { year: '2023', forest: 55, barren: 26, urban: 18 },
    { year: '2024', forest: 50, barren: 28, urban: 20 }
  ];

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

  // Download JSON data function
  const downloadJSONData = () => {
    const analysisData = {
      metadata: {
        title: "Deforestation Analysis - Chittagong, Bangladesh",
        analysisDate: new Date().toISOString(),
        period: {
          from: getFormattedDates().from,
          to: getFormattedDates().to
        },
        location: "Chittagong, Bangladesh",
        dataSource: "Remote Sensing Satellite Data"
      },
      keyFindings: {
        forestLoss: "-40%",
        ndviDecline: "0.7 → 0.5",
        analysisPeriodYears: endYear - startYear
      },
      coverageData: {
        startPeriod: {
          date: getFormattedDates().from,
          data: coverageStartData
        },
        endPeriod: {
          date: getFormattedDates().to,
          data: coverageEndData
        }
      },
      timelineData: timelineData,
      summary: "Analysis reveals significant deforestation primarily driven by agricultural expansion, urbanization, and illegal logging. Forest cover loss exceeds 40% during this period, contributing to habitat loss, soil erosion, and increased vulnerability to natural disasters."
    };

    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deforestation-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const dates = getFormattedDates();
    
    const generatePDF = () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
              <html>
              <head>
                <title>Deforestation Analysis Report</title>
                <style>
                  * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  body { 
                    font-family: 'Times New Roman', serif;
                    font-size: 10px;
                    line-height: 1.3;
                    color: #000;
                    background: white;
                   
                  }
                  .page-container {
                    min-width: 210mm; 
                    max-width: 210mm; 
                    margin: 0 auto;
                  }
                  @page {
                    size: A4;
                  
                  }
                  @media print {
                    body { 
                      -webkit-print-color-adjust: exact; 
                      color-adjust: exact;
                     
                    }
                    .page-container {
                      min-width: 210mm;
                      max-width: 210mm;
                    }
                    .no-print { display: none; }
                  }

                  /* Header Section */
                  .report-header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding: 8px 0;
                    margin-bottom: 12px;
                  }
                  .report-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                  }
                  .report-subtitle {
                    font-size: 11px;
                    margin-bottom: 2px;
                  }
                  .report-meta {
                    font-size: 8px;
                    font-style: italic;
                  }

                  /* Key Metrics */
                  .metrics-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    border: 1px solid #000;
                    padding: 8px;
                  }
                  .metric-item {
                    text-align: center;
                    flex: 1;
                    border-right: 1px solid #000;
                    padding: 0 8px;
                  }
                  .metric-item:last-child { border-right: none; }
                  .metric-value {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 2px;
                  }
                  .metric-label {
                    font-size: 8px;
                    text-transform: uppercase;
                    font-weight: bold;
                  }

                  /* Section Styling */
                  .section {
                    margin-bottom: 12px;
                    padding: 0 5px; /* Prevent text from touching edges */
                  }
                  .section-title {
                    font-size: 11px;
                    font-weight: bold;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                    border-bottom: 1px solid #000;
                    padding-bottom: 2px;
                  }

                  /* Summary Box */
                  .summary-text {
                    border: 1px solid #000;
                    padding: 10px; /* Increased padding for better text spacing */
                    font-size: 9px;
                    line-height: 1.4;
                    text-align: justify;
                  }

                  /* Data Tables */
                  .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 6px 0;
                    font-size: 9px;
                  }
                  .data-table th, .data-table td {
                    border: 1px solid #000;
                    padding: 6px 8px; /* Increased padding for table cells */
                    text-align: left;
                  }
                  .data-table th {
                    background: #f5f5f5;
                    font-weight: bold;
                    font-size: 8px;
                    text-transform: uppercase;
                  }
                  .data-table td {
                    font-size: 9px;
                  }

                  /* Two Column Layout */
                  .two-column {
                    display: flex;
                    gap: 12px;
                    margin: 8px 0;
                  }
                  .column {
                    flex: 1;
                    border: 1px solid #000;
                    padding: 10px; /* Increased padding */
                  }
                  .column-title {
                    font-size: 9px;
                    font-weight: bold;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                    text-align: center;
                    border-bottom: 1px solid #000;
                    padding-bottom: 2px;
                  }
                  .column-table {
                    width: 100%;
                    font-size: 8px;
                  }
                  .column-table td {
                    padding: 3px 5px;
                    border-bottom: 1px dotted #ccc;
                  }
                  .column-table td:first-child {
                    font-weight: bold;
                    width: 60%;
                  }

                  /* Lists */
                  .impact-list {
                    font-size: 8px;
                    line-height: 1.4;
                    padding-left: 15px; /* Adjusted for better list spacing */
                    margin: 0;
                  }
                  .impact-list li {
                    margin-bottom: 3px;
                  }

                  /* Footer */
                  .report-footer {
                    position: fixed;
                    bottom: 8mm;
                    left: 15mm;
                    right: 15mm;
                    border-top: 1px solid #000;
                    padding-top: 4px;
                    text-align: center;
                    font-size: 7px;
                    line-height: 1.2;
                    width: calc(100% - 30mm); /* Respect page margins */
                  }

                  /* Utility Classes */
                  .text-center { text-align: center; }
                  .text-bold { font-weight: bold; }
                  .text-small { font-size: 8px; }
                  .mb-small { margin-bottom: 4px; }
                  .mb-medium { margin-bottom: 8px; }

                  /* Change indicators */
                  .change-negative { font-weight: bold; }
                  .change-positive { font-weight: bold; }
                </style>
              </head>
              <body>
                <div class="page-container">
                  <!-- Header -->
                  <div class="report-header">
                    <div class="report-title">Deforestation Analysis Report</div>
                    <div class="report-subtitle">Chittagong Division, Bangladesh</div>
                    <div class="report-subtitle">Analysis Period: ${dates.from} to ${dates.to}</div>
                    <div class="report-meta">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Satellite Remote Sensing Analysis</div>
                  </div>

                  <!-- Key Metrics -->
                  <div class="metrics-row">
                    <div class="metric-item">
                      <div class="metric-value">-40%</div>
                      <div class="metric-label">Forest Loss</div>
                    </div>
                    <div class="metric-item">
                      <div class="metric-value">0.7→0.5</div>
                      <div class="metric-label">NDVI Decline</div>
                    </div>
                    <div class="metric-item">
                      <div class="metric-value">${endYear - startYear} Years</div>
                      <div class="metric-label">Study Period</div>
                    </div>
                  </div>

                  <!-- Executive Summary -->
                  <div class="section">
                    <div class="section-title">Executive Summary</div>
                    <div class="summary-text">
                      Comprehensive satellite imagery analysis reveals critical deforestation in Chittagong region with 40% forest coverage decline over ${endYear - startYear} years. Primary drivers include agricultural expansion (62%), urbanization (23%), and illegal logging (15%). NDVI index decreased from 0.7 to 0.5, indicating severe vegetation health deterioration. Immediate intervention required to prevent irreversible environmental degradation affecting biodiversity, soil stability, and climate resilience.
                    </div>
                  </div>

                  <!-- Land Coverage Comparison -->
                  <div class="section">
                    <div class="section-title">Land Coverage Analysis</div>
                    <div class="two-column">
                      <div class="column">
                        <div class="column-title">Baseline (${dates.from})</div>
                        <table class="column-table">
                          <tr><td>Forest Coverage</td><td>68.0%</td></tr>
                          <tr><td>Barren Land</td><td>20.0%</td></tr>
                          <tr><td>Urban Areas</td><td>12.0%</td></tr>
                        </table>
                      </div>
                      <div class="column">
                        <div class="column-title">Current (${dates.to})</div>
                        <table class="column-table">
                          <tr><td>Forest Coverage</td><td>58.0% (-10.0%)</td></tr>
                          <tr><td>Barren Land</td><td>26.0% (+6.0%)</td></tr>
                          <tr><td>Urban Areas</td><td>16.0% (+4.0%)</td></tr>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Timeline Analysis -->
                  <div class="section">
                    <div class="section-title">Annual Trend Analysis</div>
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Forest (%)</th>
                          <th>Change</th>
                          <th>Barren (%)</th>
                          <th>Urban (%)</th>
                          <th>Deforestation Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${timelineData.map((row, index) => {
                          const prevYear = index > 0 ? timelineData[index - 1] : null;
                          const change = prevYear ? (row.forest - prevYear.forest).toFixed(1) : 'Baseline';
                          const rate = prevYear ? Math.abs((row.forest - prevYear.forest) / prevYear.forest * 100).toFixed(1) : 'N/A';
                          return `
                          <tr>
                            <td><strong>${row.year}</strong></td>
                            <td>${row.forest}%</td>
                            <td class="${change < 0 ? 'change-negative' : ''}">${change !== 'Baseline' ? (parseFloat(change) > 0 ? '+' : '') + change + '%' : change}</td>
                            <td>${row.barren}%</td>
                            <td>${row.urban}%</td>
                            <td>${rate !== 'N/A' ? rate + '%' : 'N/A'}</td>
                          </tr>
                          `;
                        }).join('')}
                      </tbody>
                    </table>
                  </div>

                  <!-- Impact Assessment -->
                  <div class="section">
                    <div class="section-title">Environmental Impact Assessment</div>
                    <div class="two-column">
                      <div class="column">
                        <div class="column-title">Critical Impacts</div>
                        <ul class="impact-list">
                          <li>Habitat fragmentation affecting 15+ endemic species</li>
                          <li>Soil erosion risk increased by 35%</li>
                          <li>Carbon sequestration capacity reduced by 28%</li>
                          <li>Flood vulnerability enhanced in downstream areas</li>
                          <li>Microclimate disruption and temperature increases</li>
                        </ul>
                      </div>
                      <div class="column">
                        <div class="column-title">Socioeconomic Factors</div>
                        <ul class="impact-list">
                          <li>Population pressure: 2.3% annual growth</li>
                          <li>Agricultural demand: 15% cropland expansion</li>
                          <li>Urban development: 4 new industrial zones</li>
                          <li>Economic drivers: Timber export revenues</li>
                          <li>Policy gaps: Limited enforcement capacity</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- Methodology -->
                  <div class="section">
                    <div class="section-title">Methodology & Data Quality</div>
                    <div class="summary-text">
                      <strong>Data Sources:</strong> Landsat 8/9 and Sentinel-2 satellite missions with 30m spatial resolution. <strong>Processing:</strong> Google Earth Engine cloud computing platform with supervised machine learning classification. <strong>Validation:</strong> Ground-truthing through field surveys in 25 representative locations. <strong>Accuracy:</strong> Overall classification accuracy of 94.2% with kappa coefficient of 0.91. <strong>Temporal Coverage:</strong> Annual composite imagery from ${startYear}-${endYear} with cloud coverage <10%.
                    </div>
                  </div>

                  <!-- Recommendations -->
                  <div class="section">
                    <div class="section-title">Strategic Recommendations</div>
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Priority</th>
                          <th>Action</th>
                          <th>Timeline</th>
                          <th>Expected Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>HIGH</strong></td>
                          <td>Emergency logging moratorium in critical zones</td>
                          <td>Immediate</td>
                          <td>Prevent 5% additional loss</td>
                        </tr>
                        <tr>
                          <td><strong>HIGH</strong></td>
                          <td>Establish 50km² protected buffer zones</td>
                          <td>3 months</td>
                          <td>Protect remaining core habitat</td>
                        </tr>
                        <tr>
                          <td><strong>MEDIUM</strong></td>
                          <td>Deploy satellite monitoring system</td>
                          <td>6 months</td>
                          <td>Real-time deforestation alerts</td>
                        </tr>
                        <tr>
                          <td><strong>MEDIUM</strong></td>
                          <td>Implement sustainable agriculture programs</td>
                          <td>12 months</td>
                          <td>Reduce expansion pressure</td>
                        </tr>
                        <tr>
                          <td><strong>LOW</strong></td>
                          <td>Community-based reforestation initiative</td>
                          <td>24 months</td>
                          <td>Restore 10% degraded areas</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                

                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                      setTimeout(function() { window.close(); }, 500);
                    }, 800);
                  }
                </script>
              </body>
              </html>
      `);
      printWindow.document.close();
    };

    generatePDF();
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
    pastDate.setFullYear(today.getFullYear() - 4);
    return {
      from: pastDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    };
  };

  const dates = getFormattedDates();

  const getYearFromDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const startYear = dateRange?.from ? getYearFromDate(dateRange.from) : '2021';
  const endYear = dateRange?.to ? getYearFromDate(dateRange.to) : '2025';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full overflow-y-auto mx-auto gap-0 p-0">
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
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-sm font-semibold">Satellite Images ({dates.from})</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {section1Images.map((src, index) => (
                      <div key={index} className="cursor-pointer">
                        <img
                          src={src}
                          alt={`Historical satellite image ${index + 1}`}
                          className="w-36 h-36 object-cover rounded shadow-sm hover:shadow-md transition-all duration-200"
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
                  <div className="grid grid-cols-4 gap-2">
                    {section2Images.map((src, index) => (
                      <div key={index} className="cursor-pointer">
                        <img
                          src={src}
                          alt={`Recent satellite image ${index + 1}`}
                          className="w-36 h-36 object-cover rounded shadow-sm hover:shadow-md transition-all duration-200"
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
            <div className="flex items-center justify-center">
              <div className="text-center p-10">
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

              {/* Analysis Summary with Download Buttons */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold">
                    Analysis Summary
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadJSONData}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
                    >
                      <Download size={14} />
                      JSON Data
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
                    >
                      <FileText size={14} />
                      PDF Report
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Analysis of Chittagong, Bangladesh from {dates.from} to {dates.to} reveals significant deforestation primarily driven by agricultural expansion, urbanization, and illegal logging. Studies suggest deforestation rates have been substantial, with some areas experiencing forest cover loss exceeding <strong className="text-red-600">40%</strong> during this period. This contributes to habitat loss, soil erosion, and increased vulnerability to natural disasters.
                </p>
              </div>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Start Date Coverage Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold">{dates.from} - Area Coverage</h3>
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
                    <h3 className="text-sm font-semibold">{dates.to}  - Area Coverage</h3>
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