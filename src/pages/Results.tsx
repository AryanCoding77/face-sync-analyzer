
import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ResultsDisplay from '../components/Analysis/ResultsDisplay';
import CompareAILink from '../components/Integration/CompareAILink';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { FaceAnalysisResult } from '../lib/faceAnalysisTypes';
import { toast } from 'sonner';

const Results = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [results, setResults] = useState<FaceAnalysisResult | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Retrieve the image data and analysis results from session storage
    const storedImage = sessionStorage.getItem('analysisImage');
    const storedResults = sessionStorage.getItem('analysisResult');
    
    if (!storedImage || !storedResults) {
      // If no data is available, redirect to the analysis page
      toast.error('No analysis data found. Please upload a photo first.');
      navigate('/analysis');
      return;
    }
    
    setImageData(storedImage);
    
    try {
      // Parse the stored results
      const parsedResults = JSON.parse(storedResults) as FaceAnalysisResult;
      setResults(parsedResults);
    } catch (error) {
      console.error('Error parsing analysis results:', error);
      toast.error('There was an error processing your results. Please try again.');
      navigate('/analysis');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="page-container">
          <Link to="/analysis" className="inline-flex items-center text-text-secondary hover:text-text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Link>
          
          <div className="max-w-xl mx-auto text-center mb-12 animate-fade-in">
            <span className="badge-blue py-1 px-3 mb-4">Step 2 of 2</span>
            <h1 className="heading-md mb-4">Your Analysis Results</h1>
            <p className="subtitle max-w-md mx-auto">
              Here's what our advanced facial analysis technology discovered about your unique features
            </p>
          </div>
          
          <ResultsDisplay imageData={imageData || undefined} results={results || undefined} />
          
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-center mb-8">Ready for More?</h2>
            <CompareAILink />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
