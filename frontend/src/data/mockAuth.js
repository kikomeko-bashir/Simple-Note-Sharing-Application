// Mock authentication service
import { findUserByEmail, findUserById } from './mockUsers.js';

// Simulate JWT token generation
const generateMockToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  
  // Simple base64 encoding for mock token
  return btoa(JSON.stringify(payload));
};

// Simulate JWT token verification
const verifyMockToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp < now) {
      return null; // Token expired
    }
    
    return payload;
  } catch (error) {
    return null; // Invalid token
  }
};

// Mock authentication functions
export const mockAuth = {
  // Login with email and password - ACCEPTS ANY CREDENTIALS
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any email/password combination
    const user = {
      id: Date.now(), // Generate unique ID
      email: email,
      name: email.split('@')[0], // Use email prefix as name
      password: password
    };
    
    const token = generateMockToken(user);
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  },
  
  // Register new user - ACCEPTS ANY DATA
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { email, password, name } = userData;
    
    // Accept any registration data
    const newUser = {
      id: Date.now(), // Simple ID generation
      email,
      password,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    const token = generateMockToken(newUser);
    
    return {
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    };
  },
  
  // Verify token and get user
  verifyToken: async (token) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const payload = verifyMockToken(token);
    
    if (!payload) {
      throw new Error('Invalid or expired token');
    }
    
    const user = findUserById(payload.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
};
