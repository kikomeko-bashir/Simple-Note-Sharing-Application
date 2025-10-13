// Mock user data for development
export const mockUsers = [
  {
    id: 1,
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

// Helper function to find user by email
export const findUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

// Helper function to find user by id
export const findUserById = (id) => {
  return mockUsers.find(user => user.id === parseInt(id));
};
