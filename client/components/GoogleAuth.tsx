import React from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import axios from 'axios';

interface GoogleAuthProps {
  onSuccess: (userData: { username: string; email: string }) => void;
}

export function GoogleAuth({ onSuccess }: GoogleAuthProps) {
  const handleGoogleResponse = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('profileObj' in response) {
      try {
        const { data } = await axios.post('http://localhost:5000/api/users/google-login', {
          token: response.tokenId,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        onSuccess({ username: response.profileObj.name, email: response.profileObj.email });
      } catch (error) {
        console.error('Google login error:', error);
      }
    }
  };

  return (
    <GoogleLogin
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
      buttonText="Sign in with Google"
      onSuccess={handleGoogleResponse}
      onFailure={handleGoogleResponse}
      cookiePolicy={'single_host_origin'}
    />
  );
}
