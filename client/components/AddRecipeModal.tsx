import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SharedRecipe {
  id: string;
  title: string;
  author: string;
  description: string;
  likes: number;
  date: string;
}

interface User {
  username: string;
  email?: string;
  userId?: string;
}

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (recipe: SharedRecipe) => void;
  user: User | null;
}

export function AddRecipeModal({ isOpen, onClose, onAddRecipe, user }: AddRecipeModalProps) {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const newRecipe: SharedRecipe = {
        id: Date.now().toString(),
        title,
        author: user ? user.username : 'Anonymous',
        description,
        likes: 0,
        date: new Date().toISOString().split('T')[0]
      };
      onAddRecipe(newRecipe);
      setTitle('');
      setDescription('');
      setSubmitMessage('Recipe shared successfully!');
    } catch (error) {
      console.error('Error sharing recipe:', error);
      setSubmitMessage('Failed to share recipe. Please try again.');
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
