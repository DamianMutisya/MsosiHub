'use client'

import React, { useState, useEffect } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { LoginResponse } from '../types/types';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface GoogleAuthProps {
  onGoogleLogin: (userData: LoginResponse) => void;
}

export function GoogleAuth({ onGoogleLogin }: GoogleAuthProps) {
  const { googleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleResponse = async (credentialResponse: CredentialResponse) => {
    try {
      console.log('Google credential received');
      
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Log the API URL being used
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const userData = await googleLogin(credentialResponse.credential);
      console.log('Google login successful:', userData);
      onGoogleLogin(userData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Detailed Google login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      setError(error.message);
    }
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
        console.log('API connection test:', response.data);
      } catch (error) {
        console.error('API connection test failed:', error);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleResponse}
        onError={() => {
          console.error('Google Login Failed');
          setError('Google login failed. Please try again.');
        }}
        useOneTap
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}