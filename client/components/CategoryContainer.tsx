import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";

interface CategoryContainerProps {
  onCategorySelect: (category: string | null) => void;
}

export function CategoryContainer({ onCategorySelect }: CategoryContainerProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['Breakfast', 'Lunch', 'Dinner', 'Snacks']); // Fallback categories
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => handleCategoryClick(category)}
            className="px-4 py-2 rounded-full"
          >
            {category}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            setSelectedCategory(null);
            onCategorySelect(null);
          }}
          className="px-4 py-2 rounded-full"
        >
          View All
        </Button>
      </div>
    </div>
  );
}
