
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="inline-block">
              <span className="text-lg font-semibold text-text-primary">FaceSync</span>
            </Link>
            <p className="mt-4 text-text-secondary text-sm max-w-xs">
              Advanced facial analysis technology that provides insightful details about your facial features.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                  Analysis
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                  Compare AI
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                  Results
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm">
                  Data Processing
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-text-secondary text-center">
            &copy; {new Date().getFullYear()} FaceSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
