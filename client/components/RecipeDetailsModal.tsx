import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecipeDetailsProps {
  recipes: {
    recipe_name: string;
    ingredients: string[];
    instructions: string[];
    youtubeLink?: string;
  }[];
  isOpen: boolean;
  onClose: () => void;
  onError: (error: Error) => void;
}

export function RecipeDetailsModal({ recipes, isOpen, onClose}: RecipeDetailsProps) {
  if (!isOpen) return null;

  console.log('RecipeDetailsModal rendered with recipes:', recipes);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Results</DialogTitle>
        </DialogHeader>
        {recipes && recipes.length > 0 ? (
          <Tabs defaultValue={recipes[0].recipe_name}>
            <TabsList>
              {recipes.map((recipe) => (
                <TabsTrigger key={recipe.recipe_name} value={recipe.recipe_name}>
                  {recipe.recipe_name}
                </TabsTrigger>
              ))}
            </TabsList>
            {recipes.map((recipe) => (
              <TabsContent key={recipe.recipe_name} value={recipe.recipe_name}>
                <h3 className="text-lg font-semibold mb-2">{recipe.recipe_name}</h3>
                <h4 className="font-medium mt-4 mb-2">Ingredients:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h4 className="font-medium mt-4 mb-2">Instructions:</h4>
                <ol className="list-decimal pl-5 mb-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
                {recipe.youtubeLink && (
                  <Button
                    onClick={() => window.open(recipe.youtubeLink, '_blank')}
                    className="mt-4"
                  >
                    Watch Video
                  </Button>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <p className="text-center py-4">No recipes found. Try a different search term.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
