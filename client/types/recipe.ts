export interface Recipe {
  _id: string;
  recipe_name: string;
  ingredients: string[];
  instructions: string[];
  description?: string;
  youtubeLink?: string;
  // ... any other properties your Recipe type might have
}
