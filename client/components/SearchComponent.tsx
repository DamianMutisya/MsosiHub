import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';

interface Recipe {
  _id: string;
  recipe_name: string;
  // Add other fields as necessary
}

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
      if (Array.isArray(response.data)) {
        onSearchResults(response.data);
      } else {
        onSearchResults([response.data]);
      }
    } catch (error) {
      setError('An error occurred while searching for recipes. Please try again.');
      console.error('Search error:', error);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-8">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search Kenyan recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-20 py-3 rounded-full border-2 border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800 shadow-lg"
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
        <Button 
          type="submit" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
