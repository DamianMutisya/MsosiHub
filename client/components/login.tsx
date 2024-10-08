import React, { useState } from 'react';
import axios from 'axios';
//import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoginProps {
  onSuccess: (userData: { username: string; email: string }) => void;
}

export function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      onSuccess({ username: response.data.username, email }); // Pass user data to onSuccess
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data);
        // You can also display this error to the user
        // setErrorMessage(error.response?.data.message || 'An error occurred during login');
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <Button type="submit">Login</Button>
        </form>

      </CardContent>
    </Card>
  );
}
