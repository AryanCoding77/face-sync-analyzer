
import React from 'react';
import HeroSection from '../components/Hero/HeroSection';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/UI/Card';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import { ArrowRight, Shield, Fingerprint, ScanFace, Link as LinkIcon } from 'lucide-react';
import { useInViewAnimation } from '../lib/animations';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Index = () => {
  const { elementRef: featureRef, isInView: featuresInView } = useInViewAnimation();
  const { elementRef: integrationRef, isInView: integrationInView } = useInViewAnimation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-24 bg-white" ref={el => featureRef.current = el}>
          <div className="page-container">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="badge-blue py-1 px-3 mb-4">Advanced Technology</span>
              <h2 className="heading-md mb-6">Discover the Science Behind Our Analysis</h2>
              <p className="subtitle">
                Our platform uses state-of-the-art facial recognition technology to analyze over 100 data points on your face,
                providing you with accurate and insightful information about your unique features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className={`transition-all duration-700 delay-100 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card variant="glass" hoverEffect className="h-full">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-accent-blue/10 flex items-center justify-center mb-4">
                      <ScanFace className="h-6 w-6 text-accent-blue" />
                    </div>
                    <CardTitle>Facial Recognition</CardTitle>
                    <CardDescription>
                      Advanced AI identifies and maps key points on your face
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary text-sm">
                      Our system uses advanced machine learning algorithms to accurately detect and analyze facial landmarks,
                      creating a detailed map of your unique features.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Feature 2 */}
              <div className={`transition-all duration-700 delay-200 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card variant="glass" hoverEffect className="h-full">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-accent-blue/10 flex items-center justify-center mb-4">
                      <Fingerprint className="h-6 w-6 text-accent-blue" />
                    </div>
                    <CardTitle>Detailed Analysis</CardTitle>
                    <CardDescription>
                      Get insights about your facial structure and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary text-sm">
                      Discover your face shape, skin type, facial symmetry, and other fascinating details about your
                      appearance that make you uniquely you.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Feature 3 */}
              <div className={`transition-all duration-700 delay-300 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card variant="glass" hoverEffect className="h-full">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-accent-blue/10 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-accent-blue" />
                    </div>
                    <CardTitle>Privacy-Focused</CardTitle>
                    <CardDescription>
                      Your data is secure and never shared without consent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary text-sm">
                      We prioritize your privacy and security. Your facial data is encrypted, processed securely,
                      and never shared with third parties without your explicit permission.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/analysis">
                <Button size="lg">
                  Start Your Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Integration Section */}
        <section className="py-24 bg-surface-light" ref={el => integrationRef.current = el}>
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={`transition-all duration-700 ${integrationInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <span className="badge-blue py-1 px-3 mb-4">Seamless Integration</span>
                <h2 className="heading-md mb-6">Connect with Compare AI</h2>
                <p className="subtitle mb-8">
                  Take your facial analysis to the next level by connecting with Compare AI.
                  Compare your facial features with friends and see how you match up!
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-accent-blue/10 flex items-center justify-center mr-3 mt-0.5">
                      <LinkIcon className="h-3 w-3 text-accent-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-base mb-1">Unified Account</h4>
                      <p className="text-text-secondary text-sm">
                        Your FaceSync account automatically syncs with Compare AI for a seamless experience.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-accent-blue/10 flex items-center justify-center mr-3 mt-0.5">
                      <LinkIcon className="h-3 w-3 text-accent-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-base mb-1">Share Your Results</h4>
                      <p className="text-text-secondary text-sm">
                        Easily share your facial analysis with friends on Compare AI with just a few clicks.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-accent-blue/10 flex items-center justify-center mr-3 mt-0.5">
                      <LinkIcon className="h-3 w-3 text-accent-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-base mb-1">Extended Features</h4>
                      <p className="text-text-secondary text-sm">
                        Access exclusive features when you connect your accounts.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Link to="/compare">
                  <Button size="lg">
                    Learn More About Integration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className={`transition-all duration-700 ${integrationInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-accent-blue/20 to-purple-500/20 rounded-3xl blur-xl opacity-50"></div>
                  <div className="relative bg-white rounded-2xl shadow-elevated overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-accent-blue to-purple-500"></div>
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-accent-blue/10 flex items-center justify-center mr-3">
                            <ScanFace className="h-5 w-5 text-accent-blue" />
                          </div>
                          <div>
                            <h3 className="font-semibold">FaceSync</h3>
                            <p className="text-xs text-text-secondary">Connected with Compare AI</p>
                          </div>
                        </div>
                        <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="h-24 bg-gray-50 rounded-lg animate-pulse"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-10 bg-gray-50 rounded-lg animate-pulse"></div>
                          <div className="h-10 bg-gray-50 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="h-12 bg-accent-blue rounded-lg flex items-center justify-center text-white font-medium">
                          Connect Accounts
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
