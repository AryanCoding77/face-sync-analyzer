import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import FaceUploader from '../components/Analysis/FaceUploader';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeFace } from '../lib/faceApiService';
import { toast } from 'sonner';
import type { FaceAnalysisResult } from '../lib/faceAnalysisTypes';

const Analysis = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  
  const handleImageCaptured = async (capturedImage: string) => {
    setImageData(capturedImage);
    setIsAnalyzing(true);
    
    try {
      console.log("Image captured, starting analysis...");
      
      // Store the image data in session storage 
      sessionStorage.setItem('analysisImage', capturedImage);
      
      // Call Face++ API to analyze the face
      const analysisResult = await analyzeFace(capturedImage);
      console.log("Analysis result:", analysisResult);
      
      // Store the analysis result
      sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
      
      // Navigate to the results page
      navigate('/results');
    } catch (error) {
      console.error('Error during face analysis:', error);
      setIsAnalyzing(false);
      
      // Show more specific error message if available
      if (error instanceof Error) {
        if (error.message.includes('No faces detected')) {
          toast.error('No faces detected in the image. Please try with a clearer photo.');
        } else {
          toast.error(`Analysis failed: ${error.message}`);
        }
      } else {
        toast.error('Face analysis failed. Please try again with a clearer photo.');
      }
    }
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
          
          <FaceUploader 
            onImageCaptured={handleImageCaptured} 
            isAnalyzing={isAnalyzing}
          />
          
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
              <p className="mt-4 text-xs text-gray-500">
                Note: The app is now using your Face++ API keys for real facial analysis.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
