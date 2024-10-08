import React, { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

interface ToastContextType {
  toasts: Toast[]; // Ensure this property is defined
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID
    setToasts((prev) => [...prev, { id, ...toast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Render toasts here or in a separate component */}
      <div className="toast-container">
        {toasts.map(({ id, title, description, action }) => (
          <div key={id} className="toast">
            {title && <h4>{title}</h4>}
            {description && <p>{description}</p>}
            {action}
            <button onClick={() => removeToast(id)}>Close</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
