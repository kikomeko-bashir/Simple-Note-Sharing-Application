import React from 'react';

const SkipToContent = () => {
  const handleSkip = (e) => {
    e.preventDefault();
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
