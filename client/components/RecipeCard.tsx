import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { Button } from "@/components/ui/button"
//import { Star, Clock, ChefHat } from "lucide-react"

interface RecipeCardProps {
  title: string;
  description: string;
  image?: string;
  onClick?: () => void;
  instructions?: string[];
  youtubeLink?: string;
}

export function RecipeCard({ title, description, image, onClick }: RecipeCardProps) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {image && (
          <div className="relative w-full h-40 mb-4">
            <Image
              src={image}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
