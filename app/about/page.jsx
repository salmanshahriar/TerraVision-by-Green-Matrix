import React from 'react';

const PDFViewerPage = () => {
// PDF URL with parameters to control display
  const pdfUrl = "./TerraVision.pdf#scrollbar=1&toolbar=1&navpanes=0&pagemode=none";

  return (
    <div className="min-h-screen flex flex-row pt-14">
      {/* Header Section - 50% width */}
      <div className="w-2/5 flex-shrink-0">
        <div className="h-full px-4 sm:px-6 lg:px-8 py-8">
   
          
          <div className="">
            <h2 className="text-xl font-semibold text-black mb-4"><span className='font-bold'>Challenge Category:</span> Data Pathways to Healthy Cities and Human Settlements</h2>
            
            <div className="space-y-4 text-gray-700">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-red-600">We Want To Solve:</span> Unchecked urban growth and land degradation by using satellite imagery and AI to detect critical environmental changes.

              </p>
              
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-blue-600">Our Solution:</span> We used the EuroSAT dataset with 5,000 Sentinel-2 satellite images to train and validate our model, achieving strong accuracy. Our deep learning approach reached 88.3% accuracy across 10 land cover classes, including forests, urban areas, agricultural fields, and water bodies, and was further validated through confusion matrices and performance metrics. This confirms that our machine learning can reliably detect environmental transitions, making it a powerful tool for monitoring deforestation, desertification, and urban expansion in near real-time.
              </p>
              
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-emerald-600">The Result Of Our Solution:</span> This the revolutionizes land monitoring statistics will help governments, environmental agencies, NGOs, urban planners, and researchers or anyone responsible for protecting forests, biodiversity, and communities. By this, we can detect deforestation and urban expansion early.

              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-14">
                <p className="text-sm text-blue-700 italic font-medium text-center">
                  "Because if we don't monitor Earth's pulse today,<br/>
                  There may not be one tomorrow."
                </p>
                <p className='text-sm text-blue-700 italic font-medium text-end mt-5'>- Team Green Matrix</p>
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