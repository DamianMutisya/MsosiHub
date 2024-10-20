import React, { useState, useEffect } from 'react';
import { useCategoryFilter } from '../hooks/useCategoryFilter';
import { CategoryFilter } from './CategoryFilter';
import { CategoryRecipeCard } from './CategoryRecipeCard';
import axios from 'axios';

interface Recipe {
  _id: string;
  recipe_name: string;
  image_url?: string;
  averageRating?: number;
  cook_time?: string;
  difficulty?: string;
}

export function CategorySection() {
  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useCategoryFilter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('Selected Category:', selectedCategory); // Log selected category
    const fetchRecipes = async () => {
      if (!selectedCategory) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<Recipe[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
          params: { category: selectedCategory }
        });
        console.log('Fetched Recipes:', response.data); // Log fetched recipes
        setRecipes(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  if (isCategoriesLoading) return <div>Loading categories...</div>;
  if (categoriesError) return <div>Error loading categories: {(categoriesError as Error).message}</div>;

  return (
    <div>
      <CategoryFilter
        categories={categories || []}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      {selectedCategory && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">{selectedCategory} Recipes</h3>
          {isLoading ? (
            <div>Loading recipes...</div>
          ) : error ? (
            <div>Error loading recipes: {error.message}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <CategoryRecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
