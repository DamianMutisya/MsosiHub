import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

interface GoogleAuthProps {
  onSuccess: (userData: { username: string; email: string }) => void;
}

export function GoogleAuth({ onSuccess }: GoogleAuthProps) {
  const handleGoogleResponse = async (credentialResponse: any) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/google-login', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      // You'll need to decode the JWT to get the user's name and email
      // For simplicity, we're just passing placeholder values here
      onSuccess({ username: 'Google User', email: 'user@example.com' });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleResponse}
      onError={() => console.log('Login Failed')}
      cookiePolicy={'single_host_origin'}
    />
  );
}
