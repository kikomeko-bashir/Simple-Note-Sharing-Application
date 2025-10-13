import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button as={Link} to="/dashboard" className="flex items-center space-x-2">
            <Home size={16} />
            <span>Go to Dashboard</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
