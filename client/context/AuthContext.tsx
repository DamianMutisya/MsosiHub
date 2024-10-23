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
      console.log('Attempting login with email:', email); // Add this line
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, { email, password });
      console.log('Login response:', response.data); // Add this line
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data); // Add this line
      }
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Sending signup request with:', { username, email });
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`, { username, email, password });
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
      console.log('Attempting Google login with credential:', credential.substring(0, 10) + '...');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/google-login`, { token: credential });
      console.log('Google login response:', response.data);
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
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
