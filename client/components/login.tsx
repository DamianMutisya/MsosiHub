'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LoginResponse } from '../types/types';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import axios from 'axios';

interface LoginProps {
  onSwitchToSignUp: () => void;
  onLogin: (userData: LoginResponse) => void;
}


export function Login({ onSwitchToSignUp, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with email:', email); // Add this line
      const userData = await login(email, password);
      console.log('Login successful:', userData); // Add this line
      onLogin(userData);
    } catch (error: unknown) {
      console.error('Login error:', error); // Add this line
      if (axios.isAxiosError(error) && error.response) {
        setError(`Login failed: ${error.response.data.message}`);
      } else if (error instanceof Error) {
        setError(`Login failed: ${error.message}`);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-black text-white">Login</Button>
        </form>
        <p className="text-center mt-4">
          Don&apos;t have an account? <button onClick={onSwitchToSignUp} className="text-blue-500">Sign up</button>
        </p>
      </CardContent>
    </Card>
  );
}
