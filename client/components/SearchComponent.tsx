import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';
import { Recipe } from '../types/recipe'; // Adjust the import path as necessary

interface SearchComponentProps {
  onSearchResults: (results: Recipe[]) => void;
}

export function SearchComponent({ onSearchResults }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<Recipe[]>(`http://localhost:5000/api/recipes/${encodeURIComponent(searchTerm)}`);
      
      const resultsWithId = response.data.map(result => ({
        ...result,
        _id: result._id || `temp-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      console.log('Search results:', resultsWithId);
      onSearchResults(resultsWithId);
    } catch (error) {
      console.error('Error searching for recipes:', error);
      setError('An error occurred while searching for recipes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for recipe names..."
        className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
