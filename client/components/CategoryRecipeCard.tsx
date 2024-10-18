import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Clock, ChefHat } from 'lucide-react'
import Image from 'next/image';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;

interface Recipe {
  _id: string;
  recipe_name: string;
  image_url?: string;
  averageRating?: number;
  cook_time?: string;
  difficulty?: string;
}

interface CategoryRecipeCardProps {
  recipe: Recipe;
}

export function CategoryRecipeCard({ recipe }: CategoryRecipeCardProps) {
  const [imageUrl, setImageUrl] = useState(recipe.image_url || '');
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(!recipe.image_url);

  const fetchImageForRecipe = useCallback(async (recipeName: string) => {
    try {
      const unsplashImage = await fetchUnsplashImage(recipeName);
      if (unsplashImage) {
        setImageUrl(unsplashImage);
        setIsLoading(false);
        return;
      }

      const pixabayImage = await fetchPixabayImage(recipeName);
      if (pixabayImage) {
        setImageUrl(pixabayImage);
        setIsLoading(false);
        return;
      }

      setImageError(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching image:', error);
      setImageError(true);
      setIsLoading(false);
    }
  }, []);

  const fetchUnsplashImage = async (query: string) => {
    if (!UNSPLASH_ACCESS_KEY) return null;
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, per_page: 1 },
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
      });
      return response.data.results[0]?.urls.small;
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
      return null;
    }
  };

  const fetchPixabayImage = async (query: string) => {
    if (!PIXABAY_API_KEY) return null;
    try {
      const response = await axios.get(`https://pixabay.com/api/`, {
        params: { key: PIXABAY_API_KEY, q: query, per_page: 1 }
      });
      return response.data.hits[0]?.webformatURL;
    } catch (error) {
      console.error('Error fetching from Pixabay:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!recipe.image_url) {
      fetchImageForRecipe(recipe.recipe_name);
    }
  }, [recipe.recipe_name, recipe.image_url, fetchImageForRecipe]);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="p-0">
        {!isLoading && !imageError && (
          <Image 
            src={imageUrl || '/placeholder-image.jpg'}
            alt={recipe.recipe_name} 
            width={300}
            height={200}
            style={{ objectFit: 'cover' }}
            onError={() => {
              console.error(`Failed to load image: ${imageUrl}`);
              setImageError(true);
            }}
          />
        )}
        {(isLoading || imageError) && (
          <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">
              {isLoading ? 'Loading...' : 'Image not available'}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">{recipe.recipe_name}</CardTitle>
        <div className="flex items-center gap-2 mb-2">
          {recipe.averageRating !== undefined && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium ml-1">{recipe.averageRating.toFixed(1)}</span>
            </div>
          )}
          {recipe.cook_time && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm ml-1">{recipe.cook_time}</span>
            </div>
          )}
          {recipe.difficulty && (
            <div className="flex items-center">
              <ChefHat className="h-4 w-4 text-gray-400" />
              <span className="text-sm ml-1">{recipe.difficulty}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 bg-gray-50">
        <Button className="bg-green-600 hover:bg-green-700 text-white">View Recipe</Button>
      </CardFooter>
    </Card>
  );
}
