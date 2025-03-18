
import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import FaceUploader from '../components/Analysis/FaceUploader';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Analysis = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleImageCaptured = (capturedImage: string) => {
    setImageData(capturedImage);
    
    // In a real implementation, we would send the image to the Face++ API here
    // For demo purposes, we'll automatically navigate to results after a short delay
    setTimeout(() => {
      // Store the image data in session storage to access it on the results page
      sessionStorage.setItem('analysisImage', capturedImage);
      navigate('/results');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="page-container">
          <Link to="/" className="inline-flex items-center text-text-secondary hover:text-text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="max-w-xl mx-auto text-center mb-12 animate-fade-in">
            <span className="badge-blue py-1 px-3 mb-4">Step 1 of 2</span>
            <h1 className="heading-md mb-4">Upload Your Photo</h1>
            <p className="subtitle max-w-md mx-auto">
              Please provide a clear, front-facing photo for the most accurate facial analysis
            </p>
          </div>
          
          <FaceUploader onImageCaptured={handleImageCaptured} />
          
          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-text-secondary">
              <h4 className="font-medium text-text-primary mb-2">Photo Guidelines:</h4>
              <ul className="space-y-2 pl-5 list-disc">
                <li>Use a clear, well-lit photo</li>
                <li>Face the camera directly</li>
                <li>Ensure your full face is visible</li>
                <li>Remove glasses or accessories that cover your face</li>
                <li>Neutral expression works best for accurate analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
