'use client'

import React, { useState, useEffect } from 'react'

interface Recipe {
  _id: string;
  recipe_name: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  image_url?: string;
}

export default function Homepage(){
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to MsosiHub</h1>
      {loading ? (
        <p>Loading recipes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{recipe.recipe_name}</h2>
              <p>Category: {recipe.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}