import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"


interface RecipeCardProps {
  _id: string;
  title: string;
  description: string;
  image?: string;
  rating?: number;
  time?: string;
  difficulty?: string;
  onClick?: () => void;
  instructions?: string[];
  youtubeLink?: string;
}

export function RecipeCard({ title, description, image, onClick }: RecipeCardProps) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      {image && (
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
