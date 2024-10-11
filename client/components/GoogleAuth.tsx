'use client'

import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoginResponse } from '../types/types';
import { useAuth } from '../context/AuthContext';

interface GoogleAuthProps {
  onGoogleLogin: (userData: LoginResponse) => void;
}

export function GoogleAuth({ onGoogleLogin }: GoogleAuthProps) {
  const { googleLogin } = useAuth();

  const handleGoogleResponse = async (credentialResponse: CredentialResponse) => {
    try {
      const userData = await googleLogin(credentialResponse.credential || '');
      onGoogleLogin(userData);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleResponse}
      onError={() => console.log('Login Failed')}
    />
  );
}