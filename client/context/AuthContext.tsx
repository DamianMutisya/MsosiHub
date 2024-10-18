'use client'

import React, { createContext, useState, useContext } from 'react';
import { LoginResponse } from '../types/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: LoginResponse | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (username: string, email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  googleLogin: (credential: string) => Promise<LoginResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Sending signup request with:', { username, email });
      const response = await axios.post('http://localhost:5000/api/users/signup', { username, email, password });
      console.log('Signup response:', response.data);
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Detailed signup error:', error.message);
      } else if (axios.isAxiosError(error) && error.response) {
        console.error('Detailed signup error:', error.response.data);
      } else {
        console.error('An unexpected error occurred during signup');
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  const googleLogin = async (credential: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/google-login', { token: credential });
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
      return response.data; // Return the user data
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, googleLogin }}>
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
