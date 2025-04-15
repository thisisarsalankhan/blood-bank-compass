
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define user roles
export type UserRole = 'admin' | 'hospital' | 'donor';

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if there's a saved user in localStorage when the provider mounts
  React.useEffect(() => {
    const savedUser = localStorage.getItem('bloodbank_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication
    if (email && password) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create mock user based on role
      const newUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: role === 'admin' ? 'Admin User' : role === 'hospital' ? 'Hospital Staff' : 'Blood Donor',
        email,
        role
      };
      
      // Save user to state and localStorage
      setUser(newUser);
      localStorage.setItem('bloodbank_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodbank_user');
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Context value
  const value = {
    user,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
