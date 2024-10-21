import React from 'react'
import { Button } from "../components/ui/button"

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <Button 
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
        className="rounded-full px-4 py-2 text-sm"
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button 
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategorySelect(category)}
          className="rounded-full px-4 py-2 text-sm"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
