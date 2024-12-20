# MsosiHub

MsosiHub is a comprehensive recipe management and meal planning application, focusing on East African cuisine. It provides users with a platform to discover, save, and share recipes, as well as create personalized meal plans.

## Features

- Recipe search and browsing
- User authentication (including Google Sign-In)
- Personalized recipe recommendations
- Meal planning functionality
- Recipe rating and reviews
- Category-based recipe organization
- Integration with external recipe APIs (Edamam)
- YouTube video integration for cooking instructions

## Tech Stack

- Backend: Node.js with Express.js
- Frontend: Next.js with React
- Database: MongoDB with Mongoose ODM
- Authentication: Passport.js with Google OAuth 2.0
- Styling: Tailwind CSS



## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Google Developer account for OAuth 2.0

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/MsosiHub.git
   cd MsosiHub
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory and add the following environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   YOUTUBE_API_KEY=your_youtube_api_key
   EDAMAM_APP_ID=your_edamam_app_id
   EDAMAM_APP_KEY=your_edamam_app_key
   ```

5. Start the backend server:
   ```
   cd ../server
   npm run dev
   ```

6. In a new terminal, start the frontend development server:
   ```
   cd ../client
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

- `/api/recipes`: CRUD operations for recipes
- `/api/categories`: Get recipe categories
- `/api/meal-plans`: CRUD operations for meal plans
- `/api/users`: User-related operations
- `/auth/google`: Google authentication
- `/api/edamam-recipes`: Fetch recipes from Edamam API

## Database Models

- Recipe
- User
- MealPlan

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Edamam API for additional recipe data
- YouTube API for cooking instruction videos
