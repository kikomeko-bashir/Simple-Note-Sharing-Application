import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ onSwitchToSignup }) => {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '', // email or username
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    const id = formData.identifier.trim();
    if (!id) {
      errors.identifier = 'Email or username is required';
    } else if (id.includes('@')) {
      // Validate as email
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(id)) {
        errors.identifier = 'Invalid email address';
      }
    } else if (id.length < 2) {
      errors.identifier = 'Username must be at least 2 characters';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const id = formData.identifier.trim();
    const payload = id.includes('@')
      ? { email: id, password: formData.password }
      : { username: id, password: formData.password };

    const result = await login(payload);
    if (result.success) {
      // Redirect will be handled by the router
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            type="text"
            name="identifier"
            placeholder="Enter your email or username"
            value={formData.identifier}
            onChange={handleInputChange}
            error={formErrors.identifier}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
