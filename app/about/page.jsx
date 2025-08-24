import React from 'react';

const PDFViewerPage = () => {
// PDF URL with parameters to control display
  const pdfUrl = "./TerraVision.pdf#scrollbar=1&toolbar=1&navpanes=0&pagemode=none";

  return (
    <div className="min-h-screen flex flex-row pt-10">
      {/* Header Section - 50% width */}
      <div className="w-2/5 flex-shrink-0">
        <div className="h-full px-4 sm:px-6 lg:px-8 py-8">
   
          
          <div className="">
            <h2 className="text-xl font-semibold text-black mb-4">Data Pathways to Healthy Cities and Human Settlements</h2>
            
            <div className="space-y-4 text-gray-700">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-red-600">The Crisis:</span> Every day, our planet's surface transforms catastrophically. 
                Forests disappear, farmlands expand, rivers run dry, and cities sprawl outward—threatening our food systems, 
                water resources, and biodiversity. The UN projects that by 2050, 90% of Earth's land could face degradation 
                without immediate intervention. Most decision-makers only respond when environmental damage becomes irreversible.
              </p>
              
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-blue-600">Our Solution:</span> Terra Vision leverages satellite imagery and AI 
                to detect critical land changes before it's too late. Our EfficientNetB0 deep learning model, trained on 
                Sentinel-2 imagery and EuroSAT dataset, classifies 10 distinct land cover categories with 88.3% accuracy. 
                We transform complex satellite data into actionable insights through interactive dashboards and exportable reports.
              </p>
              
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-emerald-600">The Impact:</span> Terra Vision revolutionizes land monitoring 
                by enabling proactive detection of deforestation, desertification, and urban expansion. Our platform supports 
                policymakers, researchers, and NGOs in making data-driven decisions that advance UN Sustainable Development Goal 15: 
                Life on Land. We ensure environmental warnings are never overlooked again.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 p-4 mt-6">
                <p className="text-xs text-blue-700 italic font-medium">
                  "Terra Vision: Because if we don't monitor Earth's pulse today... There may not be one tomorrow."
                </p>
                <p className='text-sm text-blue-700 italic font-medium text-end mt-5'>- Team Terra Vision</p>
              </div>

              {/* <div className="bg-gray-50 rounded-lg p-4 mt-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Team Terra Vision</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We are a dedicated team participating in the NASA Space Apps Challenge, united by our passion for 
                  environmental protection and sustainable urban development. Our interdisciplinary approach combines 
                  cutting-edge AI research with practical environmental monitoring solutions, working towards a future 
                  where technology serves as the guardian of our planet's health.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Section - 50% width */}
      <div className="w-3/5 flex-shrink-0 px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className='mb-1 text-sm font-bold text-center'>
          Our Research Paper:
        </div> */}
        <div className="h-full">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
            {/* Alternative iframe with enhanced parameters */}
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ 
                border: 'none',
                minHeight: '600px' 
              }}
              title="TerraVision PDF Document"
              className="w-full h-full"
              loading="lazy"
            />
            
            {/* Fallback message */}
            <div className="hidden bg-gray-100 p-4 text-center text-gray-600 text-sm">
              If the PDF doesn't load properly, 
              <a 
                href="./TerraVision.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                click here to open in a new tab
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerPage;