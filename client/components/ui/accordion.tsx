import React, { useState } from 'react';
import { ReactNode } from 'react';

interface AccordionItemProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Accordion: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`accordion ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
            isOpen: openIndex === index,
            onToggle: () => toggleAccordion(index),
          });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionItem = ({ isOpen, onToggle, children }: {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="border-b">
      <div onClick={onToggle} className="cursor-pointer p-4 bg-gray-100">
        {Array.isArray(children) ? children[0] : children} {/* The trigger (title) */}
      </div>
      {isOpen && (
        <div className="p-4 bg-white">
          {React.Children.toArray(children)[1] ?? null} {/* The content */}
        </div>
      )}
    </div>
  );
};

export const AccordionTrigger = ({ children }: { children: ReactNode }) => {
  return <div className="font-semibold">{children}</div>;
};

export const AccordionContent = ({ children }: { children: ReactNode }) => {
  return <div className="text-gray-700">{children}</div>;
};
