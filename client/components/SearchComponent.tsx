import React, { useState } from 'react';
import axios from 'axios';
import { Recipe } from '../types/recipe';

interface SearchComponentProps {
  onSearchResults: (results: Recipe[]) => void;
  onError: (error: string) => void;
}

export function SearchComponent({ onSearchResults, onError }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/search`, {
        params: { term: searchTerm }
      });
      
      const resultsWithId = response.data.map((result: Recipe) => ({
        ...result,
        _id: result._id || `temp-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      console.log('Search results:', resultsWithId);
      onSearchResults(resultsWithId);
    } catch (error) {
      console.error('Error searching for recipes:', error);
      onError('An error occurred while searching for recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex items-center w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for recipe names..."
          className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 bg-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}
