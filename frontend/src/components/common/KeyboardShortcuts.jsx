import React from 'react';
import { X, Command } from 'lucide-react';
import Button from './Button.jsx';

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', 'N'], description: 'Create new note' },
        { keys: ['Ctrl', 'F'], description: 'Focus search' },
        { keys: ['Esc'], description: 'Close modal/dialog' },
      ]
    },
    {
      category: 'Actions',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Open command palette' },
        { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
      ]
    }
  ];

  // Custom Control icon component
  const ControlIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <path d="M9 9h6v6H9z"/>
    </svg>
  );

  const Key = ({ children, isModifier = false }) => (
    <kbd className={`
      inline-flex items-center px-2 py-1 text-xs font-mono
      bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200
      border border-gray-300 dark:border-gray-600 rounded
      ${isModifier ? 'font-semibold' : ''}
    `}>
      {children}
    </kbd>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Keyboard Shortcuts
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center space-x-1"
            >
              <X size={16} />
              <span>Close</span>
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {shortcuts.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </span>
                      <div className="flex items-center space-x-1">
                        {item.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <Key isModifier={['Ctrl', 'Cmd', 'Shift', 'Alt'].includes(key)}>
                              {key === 'Ctrl' && <ControlIcon />}
                              {key === 'Cmd' && <Command size={12} className="mr-1" />}
                              {!['Ctrl', 'Cmd'].includes(key) && key}
                            </Key>
                            {keyIndex < item.keys.length - 1 && (
                              <span className="text-gray-400 mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={onClose}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
