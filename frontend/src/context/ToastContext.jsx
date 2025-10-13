import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/common/ToastContainer.jsx';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback((message, options = {}) => {
    return addToast({ message, ...options });
  }, [addToast]);

  const success = useCallback((message, options = {}) => {
    return addToast({ message, type: 'success', ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ message, type: 'error', ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ message, type: 'warning', ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ message, type: 'info', ...options });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    toast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastContext;
