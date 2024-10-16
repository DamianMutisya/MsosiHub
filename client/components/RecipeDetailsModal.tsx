import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export interface RecipeDetailsProps {
  recipes: RecipeDetail[];
  isOpen: boolean;
  onClose: () => void;
  onError: (error: Error) => void;
}

// Update the RecipeDetail type
export type RecipeDetail = {
  _id: string; // Make this optional
  recipe_name: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  youtubeLink?: string;
};

export function RecipeDetailsModal({ recipes, isOpen, onClose, onError }: RecipeDetailsProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);

  if (!isOpen) return null;

  const handleRecipeClick = (recipe: RecipeDetail) => {
    setSelectedRecipe(recipe);
  };

  console.log('Recipe details:', recipes);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Recipe Details</DialogTitle>
          <DialogDescription>
            {recipes && recipes.length > 0 ? 'Click on a recipe to view details' : 'No recipes found'}
          </DialogDescription>
        </DialogHeader>
        {recipes && recipes.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="flex-shrink-0 cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleRecipeClick(recipe)}
              >
                <h3 className="font-semibold">{recipe.recipe_name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4">No recipes found. Try a different search term.</p>
        )}
        {selectedRecipe && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">{selectedRecipe.recipe_name}</h2>
            {selectedRecipe.description && <p className="mb-4">{selectedRecipe.description}</p>}
            {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
              <>
                <h4 className="font-medium mt-4 mb-2">Ingredients:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </>
            )}
            {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 && (
              <>
                <h4 className="font-medium mt-4 mb-2">Instructions:</h4>
                <ol className="list-decimal pl-5 mb-4">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </>
            )}
            {selectedRecipe.youtubeLink && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Video Tutorial:</h4>
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${selectedRecipe.youtubeLink}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getYoutubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}