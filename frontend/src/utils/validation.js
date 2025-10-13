// Validation utilities for forms

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: emailRegex,
      message: 'Please enter a valid email address'
    }
  },
  
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters'
    },
    pattern: {
      value: passwordRegex,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
  },
  
  confirmPassword: (password) => ({
    required: 'Please confirm your password',
    validate: (value) => value === password || 'Passwords do not match'
  }),
  
  name: {
    required: 'Full name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    },
    maxLength: {
      value: 50,
      message: 'Name must be less than 50 characters'
    }
  },
  
  noteTitle: {
    required: 'Title is required',
    minLength: {
      value: 3,
      message: 'Title must be at least 3 characters'
    },
    maxLength: {
      value: 100,
      message: 'Title must be less than 100 characters'
    }
  },
  
  noteContent: {
    required: 'Content is required',
    minLength: {
      value: 10,
      message: 'Content must be at least 10 characters'
    }
  }
};

// Helper function to get field error message
export const getFieldError = (errors, fieldName) => {
  return errors[fieldName]?.message || '';
};

// Helper function to check if field has error
export const hasFieldError = (errors, fieldName) => {
  return !!errors[fieldName];
};

// Helper function to get field validation class
export const getFieldValidationClass = (errors, fieldName, baseClass = '') => {
  const hasError = hasFieldError(errors, fieldName);
  const errorClass = hasError 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500';
  
  return `${baseClass} ${errorClass}`.trim();
};
