import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useToast } from '../components/ui/toast';
import { useRouter } from 'next/router';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addToast } = useToast();
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast("Passwords do not match.");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password/${token}`, { password });
      addToast("Password has been reset successfully.");
      router.push('/login');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      addToast(axiosError.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPasswordForm;
