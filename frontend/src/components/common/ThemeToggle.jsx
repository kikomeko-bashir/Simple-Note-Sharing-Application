import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import Button from './Button.jsx';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`flex items-center space-x-2 ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun size={16} />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon size={16} />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
