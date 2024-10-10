'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Twitter, Instagram, MessageSquare, Star, Clock, ChefHat, Calendar, Heart,} from "lucide-react"
import { RecipeDetailsModal } from './RecipeDetailsModal';
import axios from 'axios';
import KenyanMealPlanner from './KenyanMealPlanner';
import { MyRecipes } from './MyRecipes'
import CommunityAndHelpSection from './CommunityAndHelpSection';
import { Learn } from './learn'; // Adjust the path as necessary
import React from 'react';
import Image from 'next/image';
import { Facebook, Youtube } from 'lucide-react'
import { Book, Users, Lightbulb, UserPlus } from 'lucide-react'
import { CategoryRecipeCard } from './CategoryRecipeCard';



export interface Recipe {
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

// Add this type definition near the top of your file
type RecipeDetail = {
  _id: string;
  recipe_name: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  // Add other properties as needed
};

// At the top of your file, add or update this interface
/*interface RecipeDetailsProps {
  recipes: RecipeDetail[];
  isOpen: boolean;
  onClose: () => void;
  onError: (error: Error) => void;
}*/

export function EnhancedKenyanRecipeExplorerComponent() {

  const [selectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations,] = useState<Recipe[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error searching for recipes:', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const loadMoreRecipes = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get<Recipe[]>('http://localhost:5000/api/recipes', {
        params: {
          category: selectedCategory,
          page: page + 1,
        },
      });
      setRecipes((prev) => [...prev, ...response.data]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  const quickFilters = ['']

  return (
    <div className="min-h-screen flex flex-col">
      <Tabs defaultValue="discover" className="w-full">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Image 
                src="/images/logo.png" 
                alt="MsosiHub Logo" 
                width={80}
                height={80}
              />
              <TabsList className="hidden md:flex items-center space-x-6">
                <TabsTrigger value="discover" className="flex items-center text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200">
                  <ChefHat className="w-4 h-4 mr-1" />
                  DISCOVER
                </TabsTrigger>
                <TabsTrigger value="meal-planner" className="flex items-center text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200">
                  <Calendar className="w-4 h-4 mr-1" />
                  MEAL PLANNER
                </TabsTrigger>
                <TabsTrigger value="my-recipes" className="flex items-center text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200">
                  <Book className="w-4 h-4 mr-1" />
                  MY RECIPES
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200">
                  <Users className="w-4 h-4 mr-1" />
                  COMMUNITY
                </TabsTrigger>
                <TabsTrigger value="learn" className="flex items-center text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  LEARN
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-4">
                <button className="bg-orange-100 p-2 rounded-md">
                  <Search className="w-5 h-5 text-orange-500" />
                </button>
                <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full transition-colors duration-200 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <TabsContent value="discover">
            <div className="mb-8 relative">
              <Image
                src="/images/kenya.avif"
                alt="Description of the image"
                width={500} // Adjust based on your image size
                height={300} // Adjust based on your image size
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white rounded-lg">
                <h1 className="text-4xl font-bold mb-4">Discover the Flavors of Kenya</h1>
                <form onSubmit={handleSearch} className="w-full max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Kenyan recipes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white">
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RecipeCard
                  title="Nyama Choma"
                  description="Grilled meat, typically goat or beef, seasoned with simple spices."
                  image="/images/nyamachoma.jpg"
                  rating={4.5}
                  time="45 min"
                  difficulty="Medium"
                />
                <RecipeCard
                  title="Ugali na Sukuma Wiki"
                  description="Cornmeal staple served with sautéed collard greens."
                  image="/images/ugalisukuma.jpg"
                  rating={4.2}
                  time="30 min"
                  difficulty="Easy"
                />
                <RecipeCard
                  title="Kenyan Pilau"
                  description="Spiced rice dish with meat and aromatic spices."
                  image="/images/kenyapilau.jpg"
                  rating={4.7}
                  time="60 min"
                  difficulty="Medium"
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}></h2>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {quickFilters.map((filter) => (
                  <button
                    key={filter}
                    style={{
                      padding: '5px 10px',
                      margin: '2px',
                      border: '1px solid #ccc',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <CategoryRecipeCard
                  key={recipe._id}  // Changed from 'id' to '_id'
                  recipe={{
                    _id: recipe._id,
                    recipe_name: recipe.recipe_name,
                    image_url: recipe.image_url,
                    averageRating: recipe.averageRating,
                    cook_time: recipe.cook_time,
                    difficulty: recipe.difficulty,
                    // Map any other fields you need
                  }}
                />
              ))}
            </div>
            {recipes.length > 0 && (
              <div className="mt-8 text-center">
                <Button onClick={loadMoreRecipes} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
            {recommendations.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">You might also like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((recipe) => (
                    <CategoryRecipeCard
                      key={recipe._id}
                      recipe={{
                        _id: recipe._id,
                        recipe_name: recipe.recipe_name,
                        image_url: recipe.image_url,
                        averageRating: recipe.averageRating,
                        cook_time: recipe.cook_time,
                        difficulty: recipe.difficulty,
                        // Map any other fields you need
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="meal-planner">
            <KenyanMealPlanner />
          </TabsContent>
          <TabsContent value="my-recipes">
            <MyRecipes />
          </TabsContent>
          <TabsContent value="community">
            <CommunityAndHelpSection />
          </TabsContent>
          <TabsContent value="learn">
            <Learn />
          </TabsContent>
        </main>
      </Tabs>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image 
                src="/images/logo.png" 
                alt="MsosiHub Logo" 
                width={90} 
                height={90}
                className="mr-2"
              />
    
            </div>
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="hover:text-green-400 transition-colors duration-200"><Twitter /></a>
              <a href="#" className="hover:text-green-400 transition-colors duration-200"><Instagram /></a>
              <a href="#" className="hover:text-green-400 transition-colors duration-200"><Facebook /></a>
              <a href="#" className="hover:text-green-400 transition-colors duration-200"><Youtube /></a>
            </div>
            <FeedbackDialog />
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2023 MsosiHub. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      <RecipeDetailsModal
        recipes={searchResults}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onError={(error: Error) => console.error('Error fetching recipe details:', error)}
      />
    </div>
  );
}


function RecipeCard({ title, description, image, rating, time, difficulty }: {
  title: string;
  description: string;
  image: string;
  rating: number;
  time: string;
  difficulty: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetail[]>([]);

  const handleViewRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${encodeURIComponent(title)}`);
      setRecipeDetails(Array.isArray(response.data) ? response.data : [response.data]);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
      <CardHeader className="p-0">
        <Image 
          src={image}
          alt={title} 
          width={300}
          height={200}
          style={{ objectFit: 'cover' }}
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium ml-1">{rating}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm ml-1">{time}</span>
          </div>
          <div className="flex items-center">
            <ChefHat className="h-4 w-4 text-gray-400" />
            <span className="text-sm ml-1">{difficulty}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-gray-50">
        <Button variant="outline" size="sm" className="flex items-center">
          <Heart className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={handleViewRecipe} className="bg-green-600 hover:bg-green-700 text-white">View Recipe</Button>
      </CardFooter>
      <RecipeDetailsModal
        recipes={recipeDetails}  
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onError={(error: Error) => console.error('Error fetching recipe details:', error)}
      />
    </Card>
  )
}




function FeedbackDialog() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Feedback submitted:', { name, email, message })
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
          We value your input! Please share your thoughts, suggestions, or report any issues you&apos;ve encountered
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              placeholder="Your feedback"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}