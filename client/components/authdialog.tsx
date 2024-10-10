import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Login } from './login';
import { SignUp } from './signup';
import { GoogleAuth } from './GoogleAuth';
import Image from 'next/image';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: (userData: { username: string; email: string }) => void;
  onLogin: (userData: { username: string; email: string }) => void;
  onGoogleLogin: (userData: { username: string; email: string }) => void;
}

export function AuthDialog({
  isOpen,
  onOpenChange,
  onSignUp,
  onLogin,
  onGoogleLogin
}: AuthDialogProps) {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSwitchToLogin = () => setIsSignUp(false);
  const handleSwitchToSignUp = () => setIsSignUp(true);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to MsosiHub</DialogTitle>
        </DialogHeader>
        <GoogleAuth onSuccess={onGoogleLogin} />
        {isSignUp ? (
          <SignUp onSuccess={onSignUp} onSwitchToLogin={handleSwitchToLogin} />
        ) : (
          <Login onSuccess={onLogin} onSwitchToSignUp={handleSwitchToSignUp} />
        )}
      </DialogContent>
    </Dialog>
  );
}