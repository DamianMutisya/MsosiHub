import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "./ui/button";
import { CategoryRecipeCard } from './CategoryRecipeCard';
import { RecipeDetailsModal } from './RecipeDetailsModal';

interface Category {
  name: string;
  image: string;
}

interface Recipe {
  _id: string;
  recipe_name: string;
  image_url?: string;
  averageRating?: number;
  cook_time?: string;
  difficulty?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CategoryRecipeCardProps {
  recipe: {
    _id: string;
    recipe_name: string;
    averageRating?: number;
    cook_time?: string;
    difficulty?: string;
  };
  onViewRecipe: () => void;
}

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      const categoriesWithImages = response.data.map((name: string) => ({
        name,
        image: `/images/categories/${name.toLowerCase()}.jpg`
      }));
      setCategories(categoriesWithImages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchRecipesForCategory = async (category: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes?category=${category}`);
      setRecipes(response.data);
      setSelectedCategory(category);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to load recipes. Please try again.');
      setIsLoading(false);
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading categories...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Explore Categories</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category.name}
            onClick={() => fetchRecipesForCategory(category.name)}
            variant={selectedCategory === category.name ? "default" : "outline"}
          >
            {category.name}
          </Button>
        ))}
      </div>
      {selectedCategory && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{selectedCategory} Recipes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <CategoryRecipeCard
                key={recipe._id}
                recipe={recipe}
                onViewRecipe={() => handleViewRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      )}
      <RecipeDetailsModal
        recipes={selectedRecipe ? [selectedRecipe] : []}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onError={(error) => console.error('Error in RecipeDetailsModal:', error)}
      />
    </div>
  );
}
