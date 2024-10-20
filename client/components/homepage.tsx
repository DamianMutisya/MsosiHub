'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MessageSquare, Star, Clock, ChefHat, Heart, Calendar, Book, Users, Lightbulb, Twitter, Instagram, Facebook, Youtube } from "lucide-react"
import { RecipeDetailsModal } from './RecipeDetailsModal';
import axios from 'axios';
import KenyanMealPlanner from './KenyanMealPlanner';
import { MyRecipes } from './GlobalRecipes'
import CommunityAndHelpSection from './CommunityAndHelpSection';
import { Learn } from './learn'; // Adjust the path as necessary
import React from 'react';
import Image from "next/image";
import { CategoryRecipeCard } from './CategoryRecipeCard';
import { UserMenu } from './UserMenu';
import { SearchComponent } from './SearchComponent';
import { useAuth } from '../context/AuthContext';
import { CategorySection } from './CategorySection';



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


interface User {
  username: string;
  email?: string;
  userId?: string;
}

const getTabIcon = (tab: string) => {
  switch (tab) {
    case 'discover':
      return <ChefHat className="w-4 h-4 mr-1" />;
    case 'meal-planner':
      return <Calendar className="w-4 h-4 mr-1" />;
    case 'global-recipes':
      return <Book className="w-4 h-4 mr-1" />;
    case 'community':
      return <Users className="w-4 h-4 mr-1" />;
    case 'learn':
      return <Lightbulb className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

const getSocialIcon = (social: string) => {
  switch (social) {
    case 'Twitter':
      return <Twitter className="w-5 h-5" />;
    case 'Instagram':
      return <Instagram className="w-5 h-5" />;
    case 'Facebook':
      return <Facebook className="w-5 h-5" />;
    case 'Youtube':
      return <Youtube className="w-5 h-5" />;
    default:
      return null;
  }
};

export function EnhancedKenyanRecipeExplorerComponent() {
  const { user, logout } = useAuth();
  const [selectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations,] = useState<Recipe[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (!user || !user.token) {
        console.error('No user or token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/user-data', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log('User data:', response.data);
      // You might want to update some state with this data if needed
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

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


  const quickFilters = ['']

  const handleSearchResults = (results: Recipe[]) => {
    console.log('Search results in homepage:', results);
    setSearchResults(results);
    setIsModalOpen(true);
  };

  const handleError = (error: Error) => {
    console.error('Error in RecipeDetailsModal:', error);
    // You can add additional error handling here, such as showing a toast notification
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Tabs defaultValue="discover" className="w-full">
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Image 
                src="/images/logo.png" 
                alt="MsosiHub Logo" 
                width={100}
                height={100}
                className="transition-transform duration-300 hover:scale-105"
              />
              <TabsList className="hidden md:flex items-center space-x-6">
                {['discover', 'meal-planner', 'global-recipes', 'community', 'learn'].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab} 
                    className="flex items-center text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200 capitalize"
                  >
                    {getTabIcon(tab)}
                    {tab.replace('-', ' ').toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
              <UserMenu user={user || undefined} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <TabsContent value="discover">
              <div className="mb-12 relative overflow-hidden rounded-lg shadow-lg">
                <div className="relative h-[400px]">
                  <Image
                    src="/images/kenya.avif"
                    alt="Kenya"
                    sizes="100vw"
                    style={{
                      objectFit: 'cover',
                    }}
                    fill
                    className="transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent flex flex-col justify-center items-start text-white p-8">
                    <h1 className="text-5xl font-bold mb-4 text-white">Discover the Flavors of Kenya</h1>
                    <div className="w-full max-w-md">
                      <SearchComponent onSearchResults={handleSearchResults} />
                    </div>
                  </div>
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
              
              {/* New Category Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Explore Categories</h2>
                <CategorySection />
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
            <TabsContent value="global-recipes">
              <MyRecipes />
            </TabsContent>
            <TabsContent value="community">
              <CommunityAndHelpSection user={user as User | null} />
            </TabsContent>
            <TabsContent value="learn">
              <Learn />
            </TabsContent>
          </div>
        </main>
      </Tabs>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Image 
                src="/images/logo.png" 
                alt="MsosiHub Logo" 
                width={100} 
                height={100}
                className="mr-4"
              />
              <p className="text-sm">Exploring Kenya&apos;s culinary treasures</p>
            </div>
            <div className="flex space-x-6 mb-6 md:mb-0">
              {['Twitter', 'Instagram', 'Facebook', 'Youtube'].map((social) => (
                <a key={social} href="#" className="hover:text-green-400 transition-colors duration-200">
                  {getSocialIcon(social)}
                </a>
              ))}
            </div>
            <FeedbackDialog />
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2023 MsosiHub. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((link) => (
                <a key={link} href="#" className="hover:text-white transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <RecipeDetailsModal
        recipes={searchResults}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onError={handleError}
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
  const [isSaved, setIsSaved] = useState(false);

  const handleViewRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${encodeURIComponent(title)}`);
      setRecipeDetails(Array.isArray(response.data) ? response.data : [response.data]);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleSaveRecipe = () => {
    // Implement the logic to save the recipe
    setIsSaved(!isSaved);
    // You should also update this in your backend or local storage
  };

  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
      <CardHeader className="p-0 h-48 relative">
        <Image 
          src={image}
          alt={title} 
          layout="fill"
          objectFit="cover"
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
        <Button variant="outline" size="sm" className="flex items-center" onClick={handleSaveRecipe}>
          <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current text-red-500' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
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
















