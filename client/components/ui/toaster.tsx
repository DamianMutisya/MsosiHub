import React from 'react';
import { useToast } from "./use-toast";
import { Button } from './button';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose: () => void;
}

function Toast({ title, description, action, onClose }: ToastProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {title && <h3 className="text-sm font-medium text-gray-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-4">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {action && <div className="bg-gray-50 px-4 py-3">{action}</div>}
    </div>
  );
}
