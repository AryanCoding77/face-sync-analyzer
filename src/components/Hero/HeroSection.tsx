
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const scrollY = window.scrollY;
      const opacity = Math.max(1 - scrollY / 500, 0);
      const translateY = scrollY * 0.4;
      
      heroRef.current.style.opacity = opacity.toString();
      heroRef.current.style.transform = `translateY(${translateY}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-light">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-surface-light"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGYwZjAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBhNiA2IDAgMSAxLTEyIDAgNiA2IDAgMCAxIDEyIDB6bTI0IDI0YTYgNiAwIDEgMS0xMiAwIDYgNiAwIDAgMSAxMiAwem0wLTQ4YTYgNiAwIDEgMS0xMiAwIDYgNiAwIDAgMSAxMiAwem0tNDggMGE2IDYgMCAxIDEtMTIgMCA2IDYgMCAwIDEgMTIgMHptMCA0OGE2IDYgMCAxIDEtMTIgMCA2IDYgMCAwIDEgMTIgMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="page-container">
        <div 
          ref={heroRef}
          className="relative max-w-3xl mx-auto text-center transition-all duration-300 animate-slide-up"
        >
          {/* Pre-title badge */}
          <div className="inline-block mb-6">
            <span className="badge-blue py-1 px-3">Facial Analysis Insights</span>
          </div>
          
          <h1 className="heading-lg mb-6 text-text-primary">
            Discover the Unique Features of Your Face
          </h1>
          
          <p className="subtitle mb-10 mx-auto max-w-2xl">
            Experience advanced analysis of your facial characteristics with cutting-edge AI technology. 
            Learn about your facial symmetry, skin type, and more with remarkable precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/analysis">
              <Button size="lg">
                Analyze My Face
              </Button>
            </Link>
            <Link to="/compare">
              <Button variant="secondary" size="lg">
                Compare With Friends
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-col items-center space-y-4">
            <p className="text-text-secondary text-sm">
              Trusted by over 10,000 users worldwide
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="opacity-50 hover:opacity-80 transition-opacity">
                <svg className="h-6" viewBox="0 0 80 24" fill="currentColor">
                  <rect x="0" y="0" width="80" height="6" rx="3" />
                  <rect x="16" y="9" width="64" height="6" rx="3" />
                  <rect x="32" y="18" width="48" height="6" rx="3" />
                </svg>
              </div>
              <div className="opacity-50 hover:opacity-80 transition-opacity">
                <svg className="h-6" viewBox="0 0 80 24" fill="currentColor">
                  <circle cx="12" cy="12" r="12" />
                  <rect x="30" y="6" width="50" height="12" rx="6" />
                </svg>
              </div>
              <div className="opacity-50 hover:opacity-80 transition-opacity">
                <svg className="h-6" viewBox="0 0 80 24" fill="currentColor">
                  <path d="M0,0 L16,24 L32,0 L48,24 L64,0 L80,24" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse">
        <span className="text-text-secondary text-sm mb-2">Scroll to explore</span>
        <svg className="w-6 h-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
