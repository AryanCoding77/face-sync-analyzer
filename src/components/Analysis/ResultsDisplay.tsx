
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../UI/Card';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, BarChart, Droplets, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaceAnalysisResult } from '../../lib/faceAnalysisTypes';
import { ChartContainer, ChartLegend, ChartLegendContent } from '../ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsDisplayProps {
  imageData?: string;
  results?: FaceAnalysisResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  imageData, 
  results 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedSymmetry, setAnimatedSymmetry] = useState(0);
  
  useEffect(() => {
    // Show loading state briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isLoading && results) {
      // Animate symmetry score
      const duration = 1500;
      const startTime = Date.now();
      const endValue = results.facialSymmetry;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * endValue);
        
        setAnimatedSymmetry(value);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isLoading, results]);

  if (isLoading || !results) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="space-y-4 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-t-2 border-accent-blue animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-t-2 border-accent-blue animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-text-secondary">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare attribute data for the chart
  const attributeData = [
    { name: 'Eye Size', value: attributeToValue(results.facialAttributes.eyeSize) },
    { name: 'Nose Shape', value: attributeToValue(results.facialAttributes.noseShape) },
    { name: 'Lip Fullness', value: attributeToValue(results.facialAttributes.lipFullness) },
    { name: 'Eyebrow Thickness', value: attributeToValue(results.facialAttributes.eyebrowThickness) },
    { name: 'Forehead Height', value: attributeToValue(results.facialAttributes.foreheadHeight) },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Image */}
        <div className="md:col-span-1">
          <Card variant="elevated">
            <div className="p-4">
              {imageData ? (
                <img 
                  src={imageData} 
                  alt="Analyzed Face" 
                  className="w-full h-auto rounded-lg" 
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-text-secondary">No image</span>
                </div>
              )}
            </div>
            
            <CardFooter className="flex-col items-start">
              <h3 className="text-lg font-medium mb-1">Analysis Complete</h3>
              <p className="text-text-secondary text-sm mb-4">
                Here's what we found about your facial features
              </p>
              
              <Link to="/compare" className="w-full">
                <Button fullWidth variant="outline" className="mt-2">
                  Compare with Friends
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column - Results */}
        <div className="md:col-span-2 space-y-6">
          {/* Facial Resemblance */}
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader className="bg-accent-blue/5 border-b border-accent-blue/10">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-accent-blue mr-2" />
                <CardTitle className="text-lg">Facial Resemblance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-semibold mb-1">{results.facialResemblance.celebrity}</p>
                  <p className="text-text-secondary">Your face most resembles this celebrity</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-medium text-accent-blue">
                    {results.facialResemblance.similarityScore}%
                  </span>
                  <p className="text-text-secondary text-sm">Similarity Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Facial Symmetry */}
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader className="bg-accent-blue/5 border-b border-accent-blue/10">
              <div className="flex items-center">
                <BarChart className="w-5 h-5 text-accent-blue mr-2" />
                <CardTitle className="text-lg">Facial Symmetry</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary">Low</span>
                  <span className="text-sm text-text-secondary">High</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-blue rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${animatedSymmetry}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-text-secondary">Your facial features are <span className="font-medium text-text-primary">
                  {animatedSymmetry}% symmetrical</span></p>
                <div className="badge-blue ml-2">{animatedSymmetry > 80 ? 'Excellent' : animatedSymmetry > 60 ? 'Good' : 'Average'}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Attributes Chart */}
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader className="bg-accent-blue/5 border-b border-accent-blue/10">
              <div className="flex items-center">
                <BarChart className="w-5 h-5 text-accent-blue mr-2" />
                <CardTitle className="text-lg">Facial Attributes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 w-full">
                <ChartContainer
                  config={{
                    attributes: {
                      theme: {
                        light: "#3b82f6",
                        dark: "#60a5fa",
                      },
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={attributeData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        fill="var(--color-attributes)" 
                        radius={[0, 4, 4, 0]} 
                        barSize={20}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Features */}
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader className="bg-accent-blue/5 border-b border-accent-blue/10">
              <div className="flex items-center">
                <Fingerprint className="w-5 h-5 text-accent-blue mr-2" />
                <CardTitle className="text-lg">Key Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FeatureItem 
                  label="Face Shape" 
                  value={results.faceShape} 
                  icon={<Shield className="w-4 h-4" />}
                />
                <FeatureItem 
                  label="Skin Type" 
                  value={results.skinType} 
                  icon={<Droplets className="w-4 h-4" />}
                />
                <FeatureItem 
                  label="Skin Tone" 
                  value={results.skinTone} 
                  icon={<div className="w-4 h-4 rounded-full bg-amber-300" />}
                />
                <FeatureItem 
                  label="Eye Size" 
                  value={results.facialAttributes.eyeSize} 
                />
                <FeatureItem 
                  label="Nose Shape" 
                  value={results.facialAttributes.noseShape} 
                />
                <FeatureItem 
                  label="Lip Fullness" 
                  value={results.facialAttributes.lipFullness} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function attributeToValue(attribute: string): number {
  // Convert attribute strings to numeric values for chart visualization
  switch (attribute) {
    case 'Small':
    case 'Thin':
    case 'Low':
    case 'Pointed':
      return 25;
    case 'Medium':
    case 'Average':
    case 'Straight':
      return 50;
    case 'Large':
    case 'Full':
    case 'Thick':
    case 'High':
    case 'Wide':
    case 'Rounded':
      return 75;
    default:
      return 50;
  }
}

interface FeatureItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ label, value, icon }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <div className="flex items-center mb-1">
      {icon && <div className="text-text-secondary mr-1.5">{icon}</div>}
      <span className="text-sm font-medium text-text-secondary">{label}</span>
    </div>
    <div className="text-base font-semibold">{value}</div>
  </div>
);

export default ResultsDisplay;
