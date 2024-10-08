import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import axios from 'axios'

interface Recipe {
  _id: string;
  recipe_name: string;
  ingredients: string[];
  instructions: string[];
  category: string;
}

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (recipe: Recipe) => void;
}

export function AddRecipeModal({ isOpen, onClose, onAddRecipe }: AddRecipeModalProps) {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/recipes', {
        recipe_name: recipeName,
        ingredients: ingredients.split('\n'),
        instructions: instructions.split('\n'),
        category,
      });
      setSubmitMessage(response.data.message);
      // Reset form fields
      setRecipeName('');
      setIngredients('');
      setInstructions('');
      setCategory('');
      onAddRecipe({
        _id: response.data._id,
        recipe_name: response.data.recipe_name,
        ingredients: response.data.ingredients,
        instructions: response.data.instructions,
        category: response.data.category,
      });
    } catch (error) {
      console.error('Error adding recipe:', error);
      setSubmitMessage('Failed to add recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Recipe Name"
            value={recipeName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipeName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Ingredients (one per line)"
            value={ingredients}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIngredients(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Instructions (one per line)"
            value={instructions}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Recipe'}
          </Button>
          {submitMessage && (
            <div className={`text-sm ${submitMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
