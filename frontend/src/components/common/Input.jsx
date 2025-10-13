import React from 'react';

const Input = React.forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  helpText,
  ...props 
}, ref) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helpText ? helpId : undefined}
        className={`
          w-full px-3 py-2 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
          }
          dark:bg-gray-800 dark:text-gray-100
          hover:border-gray-400 dark:hover:border-gray-500
          ${className}
        `}
        {...props}
      />
      
      {helpText && !error && (
        <p id={helpId} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
