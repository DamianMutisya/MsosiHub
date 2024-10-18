import React, { useEffect } from 'react';

interface SimpleToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const SimpleToast: React.FC<SimpleToastProps> = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
};

export default SimpleToast;

