import React from 'react';

const LoadingSkeleton = ({ 
  lines = 3, 
  className = '',
  showAvatar = false,
  height = 'h-4'
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${height} bg-gray-300 dark:bg-gray-600 rounded ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Specific skeleton components
export const NoteCardSkeleton = () => (
  <div className="card p-6">
    <div className="animate-pulse">
      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
      </div>
    </div>
  </div>
);

export const NotesListSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <NoteCardSkeleton key={index} />
    ))}
  </div>
);

export default LoadingSkeleton;