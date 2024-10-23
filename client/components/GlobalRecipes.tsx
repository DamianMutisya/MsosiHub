import React, { useState, useCallback } from 'react'
import { useRecipeSearch } from '../hooks/useRecipeSearch'
import { useArticleFetch } from '../hooks/useArticleFetch'
import { SearchBar } from '../components/SearchBar'
import { RecipeList } from '../components/RecipeList'
import { ArticleList } from '../components/ArticleList'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { RecipeDetailsModal } from './RecipeDetailsModal'

// Add this interface for the Recipe type
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

export function MyRecipes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const { 
    data, 
    isLoading: isLoadingRecipes, 
    error: recipeError,
    fetchNextPage,
    hasNextPage,
  } = useRecipeSearch(searchTerm)

  const { data: articles, isLoading: isLoadingArticles, error: articleError } = useArticleFetch(searchTerm)

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setHasSearched(true)
  }, [])

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsModalOpen(true)
  }

  const recipes = data?.pages.flatMap(page => page.recipes) || []

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} />

      {isLoadingRecipes && recipes.length === 0 ? (
        <div>Loading recipes...</div>
      ) : recipeError ? (
        <div>Error loading recipes: {recipeError.message}</div>
      ) : recipes.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Global Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeList 
              recipes={recipes} 
              isLoading={isLoadingRecipes}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              onViewRecipe={handleViewRecipe}
            />
          </CardContent>
        </Card>
      ) : hasSearched ? (
        <div>No recipes found</div>
      ) : null}

      {searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle>Related Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingArticles ? (
              <div>Loading articles...</div>
            ) : articleError ? (
              <div>Error loading articles: {articleError.message}</div>
            ) : (
              <ArticleList articles={articles || []} />
            )}
          </CardContent>
        </Card>
      )}

      <RecipeDetailsModal
        recipes={selectedRecipe ? [selectedRecipe] : []}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onError={(error) => console.error('Error in RecipeDetailsModal:', error)}
      />
    </div>
  )
}
