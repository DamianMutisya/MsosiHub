import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddRecipeModal } from './AddRecipeModal'

interface Recipe {
  _id: string;
  recipe_name: string;
  ingredients: string[];
  instructions: string[];
  category: string;
}

export function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get<Recipe[]>('http://localhost:5000/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again later.');
    }
  };

  const handleAddRecipe = (newRecipe: Recipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError('Failed to delete recipe. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Recipes</h1>
      <Button onClick={() => setIsAddModalOpen(true)} className="mb-4">
        Add New Recipe
      </Button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe._id}>
            <CardHeader>
              <CardTitle>{recipe.recipe_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Category: {recipe.category}</p>
              <Button 
                onClick={() => handleDeleteRecipe(recipe._id)}
                variant="destructive"
                className="mt-2"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <AddRecipeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRecipe={handleAddRecipe}
      />
    </div>
  );
}