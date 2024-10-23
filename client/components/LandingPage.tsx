'use client'

import React, { useEffect } from 'react';
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Utensils, Users, BookOpen, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { AuthDialog } from './authdialog';
import Image from 'next/image';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TwitterIcon, YoutubeIcon, GithubIcon, LinkedinIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    router.push('/dashboard');
  };

  const openAuth = () => {
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('bg-white', 'shadow-md');
      } else {
        navbar?.classList.remove('bg-white', 'shadow-md');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-white">
        <header className="fixed w-full z-10 transition-all duration-300" id="navbar">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="bg-white bg-opacity-80 rounded-full p-2">
                <Image src="/images/logo.png" alt="MsosiHub Logo" width={100} height={100} />
              </div>
              <Button onClick={openAuth} className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </header>

        <main>
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/dish.jpg"
                alt="Kenyan Cuisine"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="transform scale-110 motion-safe:animate-subtle-zoom"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
            </div>
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-green-50 drop-shadow-lg"
              >
                Experience the Magic of Kenyan Flavors
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl sm:text-2xl mb-8 leading-relaxed text-green-100 drop-shadow-md"
              >
                Discover the rich flavors of Kenya as you explore authentic local recipes, traditional cooking methods, and deep cultural insights.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  onClick={openAuth}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Welcome to New Tastes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </section>

          <FeatureSection />
          <TestimonialSection />
        </main>

        <footer className="bg-green-800 text-white py-8 relative">
          <div className="absolute top-0 left-0 right-0 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L80,112C160,128,320,160,480,154.7C640,149,800,107,960,90.7C1120,75,1280,85,1360,90.7L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
            </svg>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <Image src="/images/logo.png" alt="MsosiHub Logo" width={100} height={100} className="mx-auto mb-4" />
            <div className="flex justify-center space-x-6 mb-4">
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
            <p className="text-sm font-light tracking-wider">&copy; 2024 MsosiHub. All rights reserved.</p>
          </div>
        </footer>

        <AuthDialog 
          isOpen={isAuthOpen} 
          onOpenChange={setIsAuthOpen} 
          onSignUp={handleAuthSuccess}
          onLogin={handleAuthSuccess}
          onGoogleLogin={handleAuthSuccess}
        />
      </div>
    </GoogleOAuthProvider>
  )
}

function FeatureSection() {
  const features = [
    { icon: <Utensils className="h-12 w-12 text-green-600" />, title: "Authentic Recipes", description: "Access a wide range of traditional East African recipes" },
    { icon: <Users className="h-12 w-12 text-green-600" />, title: "Community", description: "Share and discuss recipes with fellow food enthusiasts" },
    { icon: <BookOpen className="h-12 w-12 text-green-600" />, title: "Meal Planner", description: "Plan your meals with our easy-to-use tool" },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-green-800 text-center mb-12">Why Choose MsosiHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full p-4 inline-block">{feature.icon}</div>
                <CardTitle className="text-2xl font-semibold text-green-700 mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const testimonials = [
    { name: "Jane Muthoni", avatar: "JM", quote: "MsosiHub has revolutionized my cooking! I've rediscovered so many childhood recipes." },
    { name: "David Ochieng", avatar: "DO", quote: "The community feature is fantastic. I've learned so much from other East African food enthusiasts." },
    { name: "Grace Wanjiru", avatar: "GW", quote: "As an East African living abroad, MsosiHub helps me stay connected to my roots through food." },
  ]

  return (
    <section className="py-20 bg-green-700 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto">
          {/* Implement a carousel here */}
          <Card className="bg-white text-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{testimonials[0].avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-green-700 text-lg">{testimonials[0].name}</p>
                </div>
              </div>
              <p className="text-gray-600 italic text-lg">&quot;{testimonials[0].quote}&quot;</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
