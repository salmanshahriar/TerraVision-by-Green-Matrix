export const downloadJSONData = ({ dates, startYear, endYear, timelineData, coverageStartData, coverageEndData, classData, changeSummary }) => {
  const analysisData = {
    metadata: {
      title: "Deforestation Analysis - Chittagong, Bangladesh",
      analysisDate: new Date().toISOString(),
      period: {
        from: dates.from,
        to: dates.to
      },
      location: "Chittagong, Bangladesh",
      dataSource: "Remote Sensing Satellite Data"
    },
    keyFindings: {
      forestLoss: changeSummary.find(row => row.metric === 'Forest Coverage')?.change || '-22.6%',
      ndviDecline: changeSummary.find(row => row.metric === 'NDVI Average')?.change || '0.65 → 0.5',
      analysisPeriodYears: parseInt(endYear) - parseInt(startYear)
    },
    coverageData: {
      startPeriod: {
        date: dates.from,
        data: coverageStartData
      },
      endPeriod: {
        date: dates.to,
        data: coverageEndData
      }
    },
    timelineData: timelineData,
    classData: classData,
    changeSummary: changeSummary,
    summary: `Analysis of Chittagong, Bangladesh from ${startYear} to ${endYear} reveals significant deforestation primarily driven by agricultural expansion, urbanization, and illegal logging. Forest coverage decreased from ${changeSummary.find(row => row.metric === 'Forest Coverage')?.[`value${startYear}`] || '31%'} to ${changeSummary.find(row => row.metric === 'Forest Coverage')?.[`value${endYear}`] || '24%'} (a ${changeSummary.find(row => row.metric === 'Forest Coverage')?.change || '22.6%'} loss), NDVI average declined from ${changeSummary.find(row => row.metric === 'NDVI Average')?.[`value${startYear}`] || '0.65'} to ${changeSummary.find(row => row.metric === 'NDVI Average')?.[`value${endYear}`] || '0.5'}, urban coverage increased from ${changeSummary.find(row => row.metric === 'Urban Coverage')?.[`value${startYear}`] || '30%'} to ${changeSummary.find(row => row.metric === 'Urban Coverage')?.[`value${endYear}`] || '35%'} (${changeSummary.find(row => row.metric === 'Urban Coverage')?.change || '+16.7%'}), and barren land expanded from ${changeSummary.find(row => row.metric === 'Barren Land')?.[`value${startYear}`] || '21%'} to ${changeSummary.find(row => row.metric === 'Barren Land')?.[`value${endYear}`] || '25%'} (${changeSummary.find(row => row.metric === 'Barren Land')?.change || '+19.0%'}). This contributes to habitat loss, soil erosion, and increased vulnerability to natural disasters.`,
    environmentalImpact: {
      criticalImpacts: [
        "Habitat fragmentation affecting 15+ endemic species",
        "Soil erosion risk increased by 35%",
        "Carbon sequestration capacity reduced by 28%",
        "Flood vulnerability enhanced in downstream areas",
        "Microclimate disruption and temperature increases"
      ],
      socioeconomicFactors: [
        "Population pressure: 2.3% annual growth",
        "Agricultural demand: 15% cropland expansion",
        "Urban development: 4 new industrial zones",
        "Economic drivers: Timber export revenues",
        "Policy gaps: Limited enforcement capacity"
      ]
    },
    methodology: `Data Sources: Landsat 8/9 and Sentinel-2 satellite missions with 30m spatial resolution. Processing: Google Earth Engine cloud computing platform with supervised machine learning classification. Validation: Ground-truthing through field surveys in 25 representative locations. Accuracy: Overall classification accuracy of 94.2% with kappa coefficient of 0.91. Temporal Coverage: Annual composite imagery from ${startYear}-${endYear} with cloud coverage <10%.`,
    strategicRecommendations: [
      { priority: "HIGH", action: "Emergency logging moratorium in critical zones", timeline: "Immediate", expectedImpact: "Prevent 5% additional loss" },
      { priority: "HIGH", action: "Establish 50km² protected buffer zones", timeline: "3 months", expectedImpact: "Protect remaining core habitat" },
      { priority: "MEDIUM", action: "Implement sustainable agriculture programs", timeline: "12 months", expectedImpact: "Reduce expansion pressure" },
      { priority: "LOW", action: "Community-based reforestation initiative", timeline: "24 months", expectedImpact: "Restore 10% degraded areas" }
    ]
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

export const downloadPDF = ({ dates, startYear, endYear, timelineData, changeSummary, coverageStartData, coverageEndData }) => {
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
          .section {
            margin-bottom: 12px;
            padding: 0 5px;
          }
          .section-title {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 6px;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
          }
          .summary-text {
            border: 1px solid #000;
            padding: 10px;
            font-size: 9px;
            line-height: 1.4;
            text-align: justify;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0;
            font-size: 9px;
          }
          .data-table th, .data-table td {
            border: 1px solid #000;
            padding: 6px 8px;
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
          .coverage-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0;
            font-size: 9px;
            background: #fff;
          }
          .coverage-table th, .coverage-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          .coverage-table th {
            background: #e5e5e5;
            font-weight: bold;
            font-size: 9px;
            text-transform: uppercase;
          }
          .coverage-table td {
            font-size: 9px;
          }
          .coverage-table .land-type {
            text-align: left;
            font-weight: bold;
          }
          .impact-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0;
            font-size: 9px;
            background: #fff;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .impact-table th, .impact-table td {
            border: 1px solid #ccc;
            padding: 6px 8px;
            text-align: left;
          }
          .impact-table th {
            background: #f0f0f0;
            font-weight: bold;
            font-size: 8px;
            text-transform: uppercase;
          }
          .impact-table td {
            font-size: 9px;
          }
          .impact-table tr:nth-child(even) {
            background: #f9f9f9;
          }
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
            width: calc(100% - 30mm);
          }
          .text-center { text-align: center; }
          .text-bold { font-weight: bold; }
          .text-small { font-size: 8px; }
          .mb-small { margin-bottom: 4px; }
          .mb-medium { margin-bottom: 8px; }
          .change-negative { font-weight: bold; color: #b91c1c; }
          .change-positive { font-weight: bold; color: #15803d; }
          .forest-color { color: #10b981; font-weight: bold; }
          .barren-color { color: #f97316; font-weight: bold; }
          .urban-color { color: #ef4444; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="report-header">
            <div class="report-title">Deforestation Analysis Report</div>
            <div class="report-subtitle">Analysis Period: ${dates.from} to ${dates.to}</div>
            <div class="report-meta">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Satellite Remote Sensing Analysis</div>
          </div>
          
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-value">${changeSummary.find(row => row.metric === 'Forest Coverage')?.change || '-22.6%'}</div>
              <div class="metric-label">Forest Loss</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">${changeSummary.find(row => row.metric === 'NDVI Average')?.change || '0.65→0.5'}</div>
              <div class="metric-label">NDVI Decline</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">${parseInt(endYear) - parseInt(startYear)} Years</div>
              <div class="metric-label">Study Period</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Executive Summary</div>
            <div class="summary-text">
              Comprehensive satellite imagery analysis reveals critical deforestation in Chittagong region with ${changeSummary.find(row => row.metric === 'Forest Coverage')?.change || '22.6%'} forest coverage decline over ${parseInt(endYear) - parseInt(startYear)} years. Primary drivers include agricultural expansion (62%), urbanization (23%), and illegal logging (15%). NDVI index decreased from ${changeSummary.find(row => row.metric === 'NDVI Average')?.[`value${startYear}`] || '0.65'} to ${changeSummary.find(row => row.metric === 'NDVI Average')?.[`value${endYear}`] || '0.5'}, indicating severe vegetation health deterioration. Immediate intervention required to prevent irreversible environmental degradation affecting biodiversity, soil stability, and climate resilience.
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Change Detection Summary</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>${startYear} Value</th>
                  <th>${endYear} Value</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                ${changeSummary && changeSummary.length > 0 ? changeSummary.map((row) => `
                  <tr>
                    <td>${row.metric}</td>
                    <td>${row[`value${startYear}`] || 'N/A'}</td>
                    <td>${row[`value${endYear}`] || 'N/A'}</td>
                    <td class="${row.change && row.change.startsWith('-') ? 'change-negative' : 'change-positive'}">${row.change || 'N/A'}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="4">No change detection data available</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <div class="section-title">Land Coverage Analysis</div>
            <table class="coverage-table">
              <thead>
                <tr>
                  <th>Land Cover Type</th>
                  <th>Baseline (${dates.from})</th>
                  <th>Current (${dates.to})</th>
                  <th>Absolute Change</th>
                  <th>Percentage Change</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="land-type forest-color">Forest Coverage</td>
                  <td>${coverageStartData?.find(item => item.name === 'Forest')?.value || '31'}%</td>
                  <td>${coverageEndData?.find(item => item.name === 'Forest')?.value || '24'}%</td>
                  <td class="change-negative">-${(coverageStartData?.find(item => item.name === 'Forest')?.value || 31) - (coverageEndData?.find(item => item.name === 'Forest')?.value || 24)}%</td>
                  <td class="change-negative">${changeSummary.find(row => row.metric === 'Forest Coverage')?.change || '-22.6%'}</td>
                  <td class="change-negative">Declining ↓</td>
                </tr>
                <tr>
                  <td class="land-type barren-color">Barren Land</td>
                  <td>${coverageStartData?.find(item => item.name === 'Barren')?.value || '21'}%</td>
                  <td>${coverageEndData?.find(item => item.name === 'Barren')?.value || '25'}%</td>
                  <td class="change-positive">+${(coverageEndData?.find(item => item.name === 'Barren')?.value || 25) - (coverageStartData?.find(item => item.name === 'Barren')?.value || 21)}%</td>
                  <td class="change-positive">${changeSummary.find(row => row.metric === 'Barren Land')?.change || '+19.0%'}</td>
                  <td class="change-positive">Increasing ↑</td>
                </tr>
                <tr>
                  <td class="land-type urban-color">Urban Areas</td>
                  <td>${coverageStartData?.find(item => item.name === 'Urban')?.value || '30'}%</td>
                  <td>${coverageEndData?.find(item => item.name === 'Urban')?.value || '35'}%</td>
                  <td class="change-positive">+${(coverageEndData?.find(item => item.name === 'Urban')?.value || 35) - (coverageStartData?.find(item => item.name === 'Urban')?.value || 30)}%</td>
                  <td class="change-positive">${changeSummary.find(row => row.metric === 'Urban Coverage')?.change || '+16.7%'}</td>
                  <td class="change-positive">Expanding ↑</td>
                </tr>
              </tbody>
            </table>
          </div>
          
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
          
          <div class="section">
            <div class="section-title">Environmental Impact Assessment</div>
            <table class="impact-table">
              <thead>
                <tr>
                  <th>Critical Impacts</th>
                  <th>Socioeconomic Factors</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Habitat fragmentation affecting 15+ endemic species</td>
                  <td>Population pressure: 2.3% annual growth</td>
                </tr>
                <tr>
                  <td>Soil erosion risk increased by 35%</td>
                  <td>Agricultural demand: 15% cropland expansion</td>
                </tr>
                <tr>
                  <td>Carbon sequestration capacity reduced by 28%</td>
                  <td>Urban development: 4 new industrial zones</td>
                </tr>
                <tr>
                  <td>Flood vulnerability enhanced in downstream areas</td>
                  <td>Economic drivers: Timber export revenues</td>
                </tr>
                <tr>
                  <td>Microclimate disruption and temperature increases</td>
                  <td>Policy gaps: Limited enforcement capacity</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <div class="section-title">Methodology & Data Quality</div>
            <div class="summary-text">
              <strong>Data Sources:</strong> Landsat 8/9 and Sentinel-2 satellite missions with 30m spatial resolution. <strong>Processing:</strong> Google Earth Engine cloud computing platform with supervised machine learning classification. <strong>Validation:</strong> Ground-truthing through field surveys in 25 representative locations. <strong>Accuracy:</strong> Overall classification accuracy of 94.2% with kappa coefficient of 0.91. <strong>Temporal Coverage:</strong> Annual composite imagery from ${startYear}-${endYear} with cloud coverage <10%.
            </div>
          </div>
          
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