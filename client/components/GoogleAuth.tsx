import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface GoogleAuthProps {
  onSuccess: (userData: { username: string; email: string }) => void;
}

export function GoogleAuth({ onSuccess }: GoogleAuthProps) {
  const router = useRouter();

  const handleGoogleResponse = async (credentialResponse: CredentialResponse) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/google-login', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      onSuccess({ username: data.username, email: data.email });
      router.push('/dashboard'); // Redirect to dashboard after successful Google sign-in
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
