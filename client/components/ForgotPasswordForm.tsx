import React, { useState } from 'react';
import axios from 'axios';
import SimpleToast from './SimpleToast';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/forgot-password`, { email });
      setToast({ message: 'Password reset email sent. Please check your inbox.', isVisible: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setToast({ message: `Failed to send password reset email: ${error.message}`, isVisible: true });
      } else {
        setToast({ message: 'Failed to send password reset email. Please try again.', isVisible: true });
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Reset Password
        </button>
      </form>
      {toast.isVisible && (
        <SimpleToast
          message={toast.message}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      )}
    </div>
  );
};

export default ForgotPasswordForm;
