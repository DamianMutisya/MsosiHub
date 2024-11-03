'use client'

import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { LoginResponse } from '../types/types';
import { useAuth } from '../context/AuthContext';

interface GoogleAuthProps {
  onGoogleLogin: (userData: LoginResponse) => void;
}

export function GoogleAuth({ onGoogleLogin }: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { googleLogin } = useAuth();

  const handleGoogleResponse = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    try {
      const userData = await googleLogin(credentialResponse.credential || '');
      onGoogleLogin(userData);
    } catch (error) {
      console.error('Google login failed:', error);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className={isLoading ? 'opacity-50' : ''}>
        <GoogleLogin
          onSuccess={handleGoogleResponse}
          onError={() => {
            console.error('Login Failed');
          }}
          useOneTap
          type="standard"
          theme="outline"
          shape="rectangular"
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  );
}