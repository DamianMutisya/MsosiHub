import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";

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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (selectedRecipe) {
      fetchYouTubeVideo(selectedRecipe.recipe_name);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (recipes.length > 0) {
      setSelectedRecipe(recipes[0]);
    }
  }, [recipes]);

  const handleRecipeClick = (recipe: RecipeDetail) => {
    setSelectedRecipe(recipe);
  };

  const handlePrevRecipe = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNextRecipe = () => {
    setCurrentIndex((prevIndex) => Math.min(recipes.length - 1, prevIndex + 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-gray-900 rounded-lg shadow-xl flex flex-col sm:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full sm:w-1/4 bg-gray-800 p-4 overflow-y-auto"
            >
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-green-400">Recipes</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-gray-400">
                  Select a recipe to view details
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[30vh] sm:h-[calc(90vh-8rem)]">
                <div className="space-y-2">
                  {recipes.map((recipe, index) => (
                    <motion.button
                      key={recipe._id}
                      onClick={() => handleRecipeClick(recipe)}
                      className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedRecipe?._id === recipe._id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {recipe.recipe_name}
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRecipe?._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full sm:w-3/4 p-4 sm:p-6 overflow-y-auto bg-gray-800"
              >
                <ScrollArea className="h-[60vh] sm:h-[calc(90vh-2rem)]">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-400">{selectedRecipe?.recipe_name}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-green-400">Ingredients</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedRecipe?.ingredients?.map((ingredient, index) => (
                          <li key={index} className="text-sm sm:text-base text-gray-300">{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-green-400">Instructions</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        {selectedRecipe?.instructions?.map((instruction, index) => (
                          <li key={index} className="text-sm sm:text-base text-gray-300">{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {youtubeVideo && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-2 text-green-400">Video Tutorial</h3>
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeVideo.id.videoId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-lg shadow-md"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </motion.div>
            </AnimatePresence>

            <motion.div 
              className="absolute bottom-4 right-4 flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handlePrevRecipe}
                disabled={currentIndex === 0}
                className="flex items-center bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </Button>
              <Button
                onClick={handleNextRecipe}
                disabled={currentIndex === recipes.length - 1}
                className="flex items-center bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
