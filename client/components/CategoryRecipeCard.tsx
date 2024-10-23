import React from 'react';
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Star, Clock, ChefHat } from 'lucide-react'

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

export function CategoryRecipeCard({ recipe, onViewRecipe }: CategoryRecipeCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg mb-2">{recipe.recipe_name}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {recipe.averageRating && (
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              {recipe.averageRating.toFixed(1)}
            </span>
          )}
          {recipe.cook_time && (
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {recipe.cook_time}
            </span>
          )}
          {recipe.difficulty && (
            <span className="flex items-center">
              <ChefHat className="w-4 h-4 mr-1" />
              {recipe.difficulty}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button onClick={onViewRecipe} variant="outline" className="w-full">
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
