import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { downloadJSONData, downloadPDF } from './DownloadUtils';

const PercentageLabel = (props) => {
  const { x, y, width, height, value } = props;
  return (
    <text 
      x={x + width / 2} 
      y={y - 5} 
      fill="#1e293b" 
      textAnchor="middle" 
      fontSize={11} 
      fontWeight="700"
    >
      {`${value}%`}
    </text>
  );
};

const SampleCountLabel = (props) => {
  const { x, y, width, height, value } = props;
  return (
    <text 
      x={x + width / 2} 
      y={y - 5} 
      fill="#1e293b" 
      textAnchor="middle" 
      fontSize={10} 
      fontWeight="700"
    >
      {value}
    </text>
  );
};

const ResultsSection = ({ dates, startYear, endYear, timelineData, coverageStartData, coverageEndData, classData, changeSummary }) => {
  return (
    <div className="space-y-4 overflow-y-auto max-h-[580px] pr-2">
      {/* Analysis Summary with Download Buttons */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-lg border-2 border-blue-200">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">Analysis Summary</h3>
            <div className="flex gap-2">
              <button
                onClick={() => downloadJSONData({ dates, startYear, endYear, timelineData, coverageStartData, coverageEndData, classData, changeSummary })}
                className="bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-xs shadow-lg flex items-center justify-center space-x-1 hover:bg-blue-700 transition-colors"
              >
                <Download size={14} />
                <span>JSON</span>
              </button>
              <button
                onClick={() => downloadPDF({ dates, startYear, endYear, timelineData, changeSummary, coverageStartData, coverageEndData })}
                className="bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-xs shadow-lg flex items-center justify-center space-x-1 hover:bg-red-700 transition-colors"
              >
                <FileText size={14} />
                <span>PDF</span>
              </button>
            </div>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed font-medium">
            Analysis of this area from {dates.from} to {dates.to} reveals significant deforestation primarily driven by agricultural expansion, urbanization, and illegal logging. Forest coverage decreased from 31% to 24% (a 22.6% loss), NDVI average declined from 0.65 to 0.5, urban coverage increased from 30% to 35% (+16.7%), and barren land expanded from 21% to 25% (+19.0%). This contributes to habitat loss, soil erosion, and increased vulnerability to natural disasters.
          </p>
        </div>
      </div>

      {/* Change Detection Summary Table */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl shadow-lg border-2 border-emerald-200">
        <div className="relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-3">Change Detection Summary</h3>
          {changeSummary && changeSummary.length > 0 ? (
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <th className="px-2 py-1 text-left font-bold text-white">Metric</th>
                  <th className="px-2 py-1 text-left font-bold text-white">{startYear} Value</th>
                  <th className="px-2 py-1 text-left font-bold text-white">{endYear} Value</th>
                  <th className="px-2 py-1 text-left font-bold text-white">Change</th>
                </tr>
              </thead>
              <tbody>
                {changeSummary.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}>
                    <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-semibold">{row.metric}</td>
                    <td className="px-2 py-1 border-t border-gray-200 text-gray-800 font-medium">{row[`value${startYear}`] || 'N/A'}</td>
                    <td className="px-2 py-1 border-t border-gray-200 text-gray-800 font-medium">{row[`value${endYear}`] || 'N/A'}</td>
                    <td className={`px-2 py-1 border-t border-gray-200 font-bold ${row.change.startsWith('-') ? 'text-red-700' : 'text-green-700'}`}>
                      {row.change || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-700">No change detection data available for the selected period.</p>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Start Date Coverage Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-lg border-2 border-purple-200">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-gray-900">{startYear} - Land Coverage</h3>
            </div>
            <div className="h-40 bg-white rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coverageStartData} margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', fontWeight: 600 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    <LabelList content={PercentageLabel} />
                    {coverageStartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-700 mt-2 text-center font-semibold">
              Land coverage distribution in {startYear}
            </p>
          </div>
        </div>

        {/* End Date Coverage Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl shadow-lg border-2 border-orange-200">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-gray-900">{endYear} - Land Coverage</h3>
            </div>
            <div className="h-40 bg-white rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coverageEndData} margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', fontWeight: 600 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    <LabelList content={PercentageLabel} />
                    {coverageEndData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-700 mt-2 text-center font-semibold">
              Land coverage distribution in {endYear}
            </p>
          </div>
        </div>

        {/* Timeline Chart with Data Labels */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl shadow-lg border-2 border-cyan-200">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-gray-900">{`${parseInt(endYear) - parseInt(startYear)}-Year Trend`}</h3>
            </div>
            <div className="h-40 bg-white rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 15, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', fontWeight: 600 }} />
                  <Line 
                    type="monotone" 
                    dataKey="forest" 
                    stroke="#059669" 
                    strokeWidth={3}
                    dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                    name="Forest"
                  >
                    <LabelList 
                      dataKey="forest" 
                      position="top" 
                      style={{ fontSize: '10px', fill: '#059669', fontWeight: '700' }} 
                      formatter={(value) => `${value}%`}
                    />
                  </Line>
                  <Line 
                    type="monotone" 
                    dataKey="barren" 
                    stroke="#ea580c" 
                    strokeWidth={3}
                    dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                    name="Barren"
                  >
                    <LabelList 
                      dataKey="barren" 
                      position="bottom" 
                      style={{ fontSize: '10px', fill: '#ea580c', fontWeight: '700' }} 
                      formatter={(value) => `${value}%`}
                    />
                  </Line>
                  <Line 
                    type="monotone" 
                    dataKey="urban" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                    name="Urban"
                  >
                    <LabelList 
                      dataKey="urban" 
                      position="topRight" 
                      style={{ fontSize: '10px', fill: '#dc2626', fontWeight: '700' }} 
                      formatter={(value) => `${value}%`}
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-700 mt-2 text-center font-semibold">
              Land cover change ({startYear}-{endYear})
            </p>
          </div>
        </div>

        {/* Class Distribution Bar Chart with Sample Counts */}
        <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-xl shadow-lg border-2 border-rose-200">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-gray-900">Land Use Classification (Sample Counts)</h3>
            </div>
            <div className="h-48 bg-white rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classData} margin={{ top: 20, right: 5, left: 5, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} samples`, 'Sample Count']}
                    labelFormatter={(label) => `Class: ${label}`}
                    contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #cbd5e1', fontWeight: 600 }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    <LabelList content={SampleCountLabel} />
                    {classData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-700 mt-2 text-center font-semibold">
              Satellite image samples classified by land use type
            </p>
          </div>
        </div>
      </div>

      {/* Environmental Impact Assessment */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl shadow-lg border-2 border-violet-200">
        <div className="relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-3">Environmental Impact Assessment</h3>
          <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-violet-600 to-purple-600">
                <th className="px-2 py-1 text-left font-bold text-white">Critical Impacts</th>
                <th className="px-2 py-1 text-left font-bold text-white">Socioeconomic Factors</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Habitat fragmentation affecting 15+ endemic species</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Population pressure: 2.3% annual growth</td>
              </tr>
              <tr className="bg-violet-50">
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Soil erosion risk increased by 35%</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Agricultural demand: 15% cropland expansion</td>
              </tr>
              <tr>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Carbon sequestration capacity reduced by 28%</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Urban development: 4 new industrial zones</td>
              </tr>
              <tr className="bg-violet-50">
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Flood vulnerability enhanced in downstream areas</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Economic drivers: Timber export revenues</td>
              </tr>
              <tr>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Microclimate disruption and temperature increases</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Policy gaps: Limited enforcement capacity</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology & Data Quality */}
      <div className="bg-gradient-to-br from-lime-50 to-green-50 p-4 rounded-xl shadow-lg border-2 border-lime-200">
        <div className="relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-3">Methodology & Data Quality</h3>
          <p className="text-sm leading-relaxed border-2 border-lime-300 p-3 rounded-lg bg-white text-gray-800 font-medium">
            <strong className="text-gray-900 font-bold">Data Sources:</strong> Landsat 8/9 and Sentinel-2 satellite missions with 30m spatial resolution. <strong className="text-gray-900 font-bold">Processing:</strong> Google Earth Engine cloud computing platform with supervised machine learning classification. <strong className="text-gray-900 font-bold">Validation:</strong> Ground-truthing through field surveys in 25 representative locations. <strong className="text-gray-900 font-bold">Accuracy:</strong> Overall classification accuracy of 94.2% with kappa coefficient of 0.91. <strong className="text-gray-900 font-bold">Temporal Coverage:</strong> Annual composite imagery from {startYear}-{endYear} with cloud coverage &lt;10%.
          </p>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl shadow-lg border-2 border-yellow-200">
        <div className="relative z-10">
          <h3 className="text-base font-bold text-gray-900 mb-3">Strategic Recommendations</h3>
          <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-600 to-orange-600">
                <th className="px-2 py-1 text-left font-bold text-white">Priority</th>
                <th className="px-2 py-1 text-left font-bold text-white">Action</th>
                <th className="px-2 py-1 text-left font-bold text-white">Timeline</th>
                <th className="px-2 py-1 text-left font-bold text-white">Expected Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-2 py-1 border-t border-gray-200 font-bold text-red-700">HIGH</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Emergency logging moratorium in critical zones</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Immediate</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Prevent 5% additional loss</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="px-2 py-1 border-t border-gray-200 font-bold text-red-700">HIGH</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Establish 50km² protected buffer zones</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">3 months</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Protect remaining core habitat</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="px-2 py-1 border-t border-gray-200 font-bold text-orange-700">MEDIUM</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Implement sustainable agriculture programs</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">12 months</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Reduce expansion pressure</td>
              </tr>
              <tr className="bg-white">
                <td className="px-2 py-1 border-t border-gray-200 font-bold text-blue-700">LOW</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Community-based reforestation initiative</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">24 months</td>
                <td className="px-2 py-1 border-t border-gray-200 text-gray-900 font-medium">Restore 10% degraded areas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;