'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Login } from './login';
import { SignUp } from './signup';
import { GoogleAuth } from './GoogleAuth';
import { LoginResponse } from '../types/types';


interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: (userData: LoginResponse) => void;
  onLogin: (userData: LoginResponse) => void;
  onGoogleLogin: (userData: LoginResponse) => void;
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
        <GoogleAuth onGoogleLogin={onGoogleLogin} />
        {isSignUp ? (
          <SignUp onSwitchToLogin={handleSwitchToLogin} onSignUp={onSignUp} />
        ) : (
          <Login onSwitchToSignUp={handleSwitchToSignUp} onLogin={onLogin} />
        )}
      </DialogContent>
    </Dialog>
  );
}