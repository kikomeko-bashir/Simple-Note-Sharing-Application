import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api, tokenStorage } from '../services/apiClient.js';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return { ...state, isLoading: true, error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return { ...state, user: null, token: null, isAuthenticated: false, isLoading: false, error: action.payload };
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, user: null, token: null, isAuthenticated: false, isLoading: false, error: null };
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const init = async () => {
      const access = tokenStorage.getAccess();
      if (!access) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }
      try {
        const data = await api.auth.verify();
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: data.user, token: access }
        });
      } catch (e) {
        tokenStorage.clear();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };
    init();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const data = await api.auth.login(credentials);
      const { access, refresh, user } = {
        access: data.access,
        refresh: data.refresh,
        user: undefined
      };
      tokenStorage.setTokens({ access, refresh });
      // fetch user via verify
      const verifyData = await api.auth.verify();
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user: verifyData.user, token: access } });
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const msg = error?.response?.data?.detail || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: msg });
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    try {
      await api.auth.register(userData);
      // After register, perform login
      const loginRes = await login({ username: userData.username || userData.email, password: userData.password });
      if (loginRes.success) {
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS, payload: { user: state.user, token: state.token } });
        toast.success('Registration successful!');
        return { success: true };
      }
      throw new Error(loginRes.error || 'Auto login failed');
    } catch (error) {
      const msg = error?.response?.data || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.REGISTER_FAILURE, payload: msg });
      toast.error(typeof msg === 'string' ? msg : 'Registration failed');
      return { success: false, error: msg };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refresh = tokenStorage.getRefresh?.() || null;
      if (refresh) await api.auth.logout(refresh);
    } catch {}
    tokenStorage.clear();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };

  const clearError = () => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

  const value = { ...state, login, register, logout, clearError };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
