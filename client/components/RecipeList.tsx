import React, { useState } from 'react'
import { CategoryRecipeCard } from './CategoryRecipeCard'
import { Button } from "../components/ui/button"
import { useInView } from 'react-intersection-observer'
import { RecipeDetailsModal } from './RecipeDetailsModal'

interface Recipe {
  _id: string;
  recipe_name: string;
  description?: string;
  image_url?: string;
  averageRating?: number;
  cook_time?: string;
  difficulty?: string;
  ingredients?: string[];
  instructions?: string[];
  youtubeLink?: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  onViewRecipe: (recipe: Recipe) => void;
}

export function RecipeList({ recipes, isLoading, hasNextPage, fetchNextPage, onViewRecipe }: RecipeListProps) {
  const { ref, inView } = useInView()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const handleViewRecipe = (recipe: Recipe) => {
    onViewRecipe(recipe);
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.filter(recipe => recipe !== undefined).map((recipe) => (
          <CategoryRecipeCard
            key={recipe._id}
            recipe={recipe}
            onViewRecipe={() => handleViewRecipe(recipe)}
          />
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref} className="flex justify-center">
          <Button onClick={() => fetchNextPage()} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
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
