import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios from 'axios';
import { RecipeDetailsModal, RecipeDetail } from './RecipeDetailsModal'; // Import RecipeDetail
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Use the imported RecipeDetail type
type SearchResult = RecipeDetail;

interface SearchComponentProps {
  onSearchResults: (results: SearchResult[]) => void;
}

export function SearchComponent({ onSearchResults }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<SearchResult[]>(`http://localhost:5000/api/recipes/search`, {
        params: { q: searchTerm }
      });
      
      // Add _id if it's missing
      const resultsWithId = response.data.map(result => ({
        ...result,
        _id: result._id || `temp-${Math.random().toString(36).substr(2, 9)}`
      }));

      setSearchResults(resultsWithId);
      onSearchResults(resultsWithId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error searching for recipes:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'An error occurred while searching for recipes');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Kenyan recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <RecipeDetailsModal
        recipes={searchResults}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onError={(error) => setError(error.message)}
      />
    </>
  );
}
