import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Login } from './login';
import { SignUp } from './signup';
import { GoogleAuth } from './GoogleAuth';
import Image from 'next/image';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: (userData: { username: string; email: string }) => void;
  onLogin: (userData: { username: string; email: string }) => void;
  onGoogleLogin: () => void;
}

export function AuthDialog({
  isOpen,
  onOpenChange,
  onSignUp,
  onLogin,
}: AuthDialogProps) {
  const [isExistingUser, setIsExistingUser] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Image src="/images/logo.png" alt="MsosiHub Logo" width={80} height={80} />
          </div>
          <DialogTitle>Welcome to MsosiHub</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <GoogleAuth onSuccess={onLogin} />
          {isExistingUser ? (
            <Login onSuccess={onLogin} />
          ) : (
            <SignUp onSuccess={onSignUp} />
          )}
          <Button variant="link" onClick={() => setIsExistingUser(!isExistingUser)}>
            {isExistingUser ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}