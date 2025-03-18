
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../UI/Card';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Check } from 'lucide-react';

const CompareAILink: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnect = () => {
    setIsConnected(true);
  };
  
  return (
    <Card variant="elevated" className="w-full max-w-md mx-auto overflow-hidden animate-scale-in">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-accent-blue"></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Compare AI Integration</CardTitle>
            <CardDescription>
              Ready to compare with friends?
            </CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full bg-accent-blue/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-accent-blue" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Take your facial analysis results to the next level by comparing with friends on Compare AI.
          </p>
          
          {isConnected ? (
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-green-700">Successfully connected with Compare AI</span>
            </div>
          ) : (
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="h-2 w-2 rounded-full bg-accent-blue mr-2"></div>
              <span className="text-sm text-accent-blue">Ready to connect with Compare AI</span>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Benefits of integration:</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-accent-blue/10 flex items-center justify-center mr-2 mt-0.5">
                  <Check className="h-3 w-3 text-accent-blue" />
                </div>
                <span>Compare facial features with friends</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-accent-blue/10 flex items-center justify-center mr-2 mt-0.5">
                  <Check className="h-3 w-3 text-accent-blue" />
                </div>
                <span>See similarity scores with other users</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-accent-blue/10 flex items-center justify-center mr-2 mt-0.5">
                  <Check className="h-3 w-3 text-accent-blue" />
                </div>
                <span>Unified account across both platforms</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {isConnected ? (
          <Link to="/compare" className="w-full">
            <Button fullWidth>
              Go to Compare AI
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button fullWidth onClick={handleConnect}>
            Connect with Compare AI
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CompareAILink;
