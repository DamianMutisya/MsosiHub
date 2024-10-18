import React from 'react'
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {categories.map((category) => (
        <Button 
          key={category}
          variant={selectedCategory === category ? "secondary" : "outline"}
          onClick={() => onCategorySelect(category)}
          className="text-sm"
        >
          {category}
        </Button>
      ))}
      <Button 
        variant={selectedCategory === null ? "secondary" : "outline"}
        onClick={() => onCategorySelect(null)}
        className="text-sm"
      >
        All Categories
      </Button>
    </div>
  );
}

