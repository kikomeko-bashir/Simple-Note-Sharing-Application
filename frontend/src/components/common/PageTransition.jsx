import React, { useState, useEffect } from 'react';

const PageTransition = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`
        transition-all duration-300 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default PageTransition;
