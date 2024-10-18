import ResetPasswordForm from '../../components/ResetPasswordForm';
import React from 'react';
import { ToastProvider } from '../../components/ui/toast';

const ResetPasswordPage: React.FC = () => {
  return (
    <ToastProvider>
      <div>
        <h1>Reset Password</h1>
        <ResetPasswordForm />
      </div>
    </ToastProvider>
  );
};

export default ResetPasswordPage;
