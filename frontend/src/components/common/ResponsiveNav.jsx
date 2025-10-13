import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './Button.jsx';

const ResponsiveNav = ({ children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Menu</span>
        </Button>
      </div>

      {/* Desktop menu */}
      <div className="hidden lg:flex items-center space-x-2">
        {children}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2 space-y-1">
            {React.Children.map(children, (child, index) => (
              <div key={index} className="w-full">
                {React.cloneElement(child, {
                  className: `${child.props.className || ''} w-full justify-start`,
                  onClick: () => {
                    child.props.onClick?.();
                    setIsOpen(false);
                  }
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ResponsiveNav;
