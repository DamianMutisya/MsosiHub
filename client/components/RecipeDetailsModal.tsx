import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyAoySlDGPutWh9nnzMoKd07xhp3pxCYLYU';

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
};

interface YouTubeVideo {
  id: { videoId: string };
  snippet: { title: string };
}

export function RecipeDetailsModal({ recipes, isOpen, onClose, onError }: RecipeDetailsProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    if (selectedRecipe) {
      fetchYouTubeVideo(selectedRecipe.recipe_name);
    }
  }, [selectedRecipe]);

  const fetchYouTubeVideo = async (recipeName: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(recipeName + ' recipe')}&key=${YOUTUBE_API_KEY}&maxResults=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setYoutubeVideo(data.items[0]);
      } else {
        setYoutubeVideo(null);
      }
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      onError(error as Error);
    }
  };

  const handleRecipeClick = (recipe: RecipeDetail) => {
    setSelectedRecipe(recipe);
  };

  if (!isOpen) return null;

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
            {youtubeVideo && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Video Tutorial:</h4>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeVideo.id.videoId}`}
                  title={youtubeVideo.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
