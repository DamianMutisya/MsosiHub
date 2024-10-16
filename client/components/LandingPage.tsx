'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Utensils, Users, BookOpen, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { AuthDialog } from './authdialog';
import Image from 'next/image';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginResponse } from '../types/types';

export function LandingPage() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Array<{ title: string; description: string }>>([]);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  const addToast = (toast: { title: string; description: string }) => {
    setToasts(prevToasts => [...prevToasts, toast]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.slice(1));
    }, 3000);
  };

  const handleAuthSuccess = (userData: LoginResponse) => {
    setIsAuthOpen(false);
    router.push('/dashboard');
  };

  const handleSignUp = (userData: LoginResponse) => {
    setIsAuthOpen(false);
    addToast({
      title: "Sign Up Successful",
      description: `Welcome to MsosiHub, ${userData.username}!`,
    });
    router.push('/dashboard');
  };

  const handleLogin = (userData: LoginResponse) => {
    setIsAuthOpen(false);
    addToast({
      title: "Login Successful",
      description: `Welcome back to MsosiHub, ${userData.username}!`,
    });
    router.push('/dashboard');
  };

  const handleGoogleLogin = (userData: LoginResponse) => {
    handleLogin(userData);
  };

  const openAuth = () => {
    setIsAuthOpen(true);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-gray-900">
        <div className="relative">
          <Image
            src="/images/kenya.jpg"
            alt="Kenyan Background"
            fill
            className="object-cover opacity-50"
          />
          <div className="relative z-10">
            <header className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Image src="/images/logo.png" alt="MsosiHub Logo" width={120} height={120} />
                </div>
              </div>
            </header>

            <div className="container mx-auto px-4 py-20 text-center text-white">
              <h1 className="text-5xl font-bold mb-6">Discover the Flavors of Kenya</h1>
<<<<<<< HEAD
              <p className="text-xl mb-8">Explore, cook, and share authentic Kenyan recipes</p>
=======
              <p className="text-xl mb-8">Explore, cook, and share authentic Kenyan Recipes</p>
>>>>>>> 4dc062990798dc0486d0cc4c73a12832dcb0fbe1
              <Button size="lg" onClick={openAuth} className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <main>
          <FeatureSection />
          <TestimonialSection />
        </main>

        <footer className="bg-green-600 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <Image src="/images/logo.png" alt="MsosiHub Logo" width={90} height={90} className="mx-auto mb-4" />
            <p>&copy; 2023 MsosiHub. All rights reserved.</p>
          </div>
        </footer>

        <AuthDialog 
          isOpen={isAuthOpen} 
          onOpenChange={setIsAuthOpen} 
          onSignUp={handleAuthSuccess}
          onLogin={handleAuthSuccess}
          onGoogleLogin={handleAuthSuccess}
        />

        {toasts.map((toast, index) => (
          <div key={index} className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
            <h4 className="font-bold">{toast.title}</h4>
            <p>{toast.description}</p>
          </div>
        ))}
      </div>
    </GoogleOAuthProvider>
  )
}


function FeatureSection() {
  const features = [
    { icon: <Utensils className="h-10 w-10 text-green-600" />, title: "Authentic Recipes", description: "Access a wide range of traditional East African recipes" },
    { icon: <Users className="h-10 w-10 text-green-600" />, title: "Community", description: "Share and discuss recipes with fellow food enthusiasts" },
    { icon: <BookOpen className="h-10 w-10 text-green-600" />, title: "Meal Planner", description: "Plan your meals with our easy-to-use tool" },
  ]

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-green-800 text-center mb-12">Why Choose MsosiHub?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="mx-auto">{feature.icon}</div>
              <CardTitle className="text-xl font-semibold text-green-700">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
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
    <section className="py-20 bg-gray-200">
      <h2 className="text-3xl font-bold text-green-800 text-center mb-12">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-green-700">{testimonial.name}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;{testimonial.quote}&quot;</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
