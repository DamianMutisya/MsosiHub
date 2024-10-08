import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomSelectProps {
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder: string;
  options: { value: string; label: string }[];
}

export function CustomSelect({ onChange, defaultValue, placeholder, options }: CustomSelectProps) {
  const [value, setValue] = useState(defaultValue || '');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="w-[140px]">
      <Select value={value} onChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}