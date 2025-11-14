
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, pass: string) => User | null;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('vlogify_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, pass: string) => {
    // This is a mock login. In a real app, this would be an API call.
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) { // In real app, you'd compare a hashed password
      setUser(foundUser);
      localStorage.setItem('vlogify_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vlogify_user');
  };

  const register = (name: string, email: string, pass: string) => {
    // Mock registration
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      return null;
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      profilePicture: `https://picsum.photos/seed/${name}/200`,
      role: 'user',
    };
    // In a real app, you'd post this to the server
    MOCK_USERS.push(newUser);
    setUser(newUser);
    localStorage.setItem('vlogify_user', JSON.stringify(newUser));
    return newUser;
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('vlogify_user', JSON.stringify(updatedUser));
    // Also update the mock array for persistence across reloads
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
