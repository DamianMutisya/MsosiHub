import React, { ReactNode } from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, children }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
};

export const SelectTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="select-trigger">{children}</div>;
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  return <span className="select-value">{placeholder}</span>;
};

export const SelectContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="select-content">{children}</div>;
};

export const SelectItem: React.FC<{ value: string; children: ReactNode }> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

// ... existing code ...
