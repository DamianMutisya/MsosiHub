/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Star, Clock, ChefHat, Heart, Calendar, Book, Users, Lightbulb, GithubIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from "lucide-react"
import { RecipeDetailsModal } from './RecipeDetailsModal';
import axios from 'axios';
import KenyanMealPlanner from './KenyanMealPlanner';
import { MyRecipes } from './GlobalRecipes'
import CommunityAndHelpSection from './CommunityAndHelpSection';
import { Learn } from './learn'; // Adjust the path as necessary
import React from 'react';
import Image from "next/image";
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


export function EnhancedKenyanRecipeExplorerComponent() {
  const { user, logout } = useAuth();
  const [selectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      if (!user || !user.token) {
        console.error('No user or token found');
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/user-data`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log('User data:', response.data);
      // You might want to update some state with this data if needed
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
  };



  const handleSearchResults = (results: Recipe[]) => {
    console.log('Search results in homepage:', results);
    setSearchResults(results);
    setIsModalOpen(true);
    setSearchError(null);
  };

  const handleSearchError = (error: string) => {
    console.error('Search error:', error);
    setSearchError(error);
    setIsModalOpen(false);
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
                      <SearchComponent onSearchResults={handleSearchResults} onError={handleSearchError} />
                      {searchError && (
                        <p className="text-red-500 mt-2">{searchError}</p>
                      )}
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
              
              {/* Add the new CategorySection here */}
              <CategorySection />
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
      <footer className="bg-gradient-to-r from-green-800 to-green-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Image src="/images/logo.png" alt="MsosiHub Logo" width={90} height={90} className="mx-auto mb-6" />
          <div className="flex justify-center space-x-8 mb-6">
            <a href="https://github.com/DamianMutisya" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-300 transition-colors duration-200">
              <GithubIcon className="h-6 w-6" />
            </a>
            <a href="https://twitter.com/DamianMutisya" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-300 transition-colors duration-200">
              <TwitterIcon className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/in/damian-mutisya-94291b170/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-300 transition-colors duration-200">
              <LinkedinIcon className="h-6 w-6" />
            </a>
            <a href="https://www.youtube.com/@Damianomutisya" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-300 transition-colors duration-200">
              <YoutubeIcon className="h-6 w-6" />
            </a>
          </div>
          <div className="mb-6 space-x-6 text-sm">
            <a href="#" className="hover:text-green-300 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-green-300 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-green-300 transition-colors duration-200">Contact Us</a>
          </div>
          <p className="text-sm font-light tracking-wider">&copy; 2024 MsosiHub. All rights reserved.</p>
        </div>
      </footer>

      <RecipeDetailsModal
        recipes={searchResults.length > 0 ? searchResults : (selectedRecipe ? [selectedRecipe] : [])}
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${encodeURIComponent(title)}`);
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





// eslint-disable-next-line @typescript-eslint/no-unused-vars





























