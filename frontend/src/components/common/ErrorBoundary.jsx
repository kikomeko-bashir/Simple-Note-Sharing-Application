import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={48} className="text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Home size={16} />
                <span>Go Home</span>
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-800 dark:text-gray-200 overflow-auto">
                  <pre className="whitespace-pre-wrap">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
