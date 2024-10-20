require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe'); // Adjust the path if necessary

// Use the URI from .env
const uri = process.env.MONGODB_URI;

const categories = {
  Breakfast: [
    'Pancakes', 'Chapati za Maji', 'Drop Scones', 'Toast Mayai', 'Oatmeal', 'Porridge',
    'Chai ya Maziwa', 'Vimumunya vya Chumvi'
  ],
  Lunch: [
    'Pilau', 'Mseto wa Maharagwe', 'Mseto wa Ndengu', 'Swahili Biryani Rice', 'Wali wa Kuchemshwa',
    'Mukimo', 'Mashed Potato', 'Mushenye', 'Githeri', 'Mchuzi wa Maharagwe', 'Mchuzi wa Ndengu Kamande',
    'Mchuzi wa Mbaazi', 'Beef Stew', 'Stir Fried Goat Meat', 'Fried Tilapia', 'Hydrabadi Biryani',
    'Stewed Green Bananas', 'Potato Curry'
  ],
  Dinner: [
    'Swahili Biryani Stew', 'Minced Meat Balls', 'Stewed Goat Meat', 'Nyirinyiri', 'Okra Meat Dish',
    'Stewed Chicken', 'Ingokho', 'Aluru', 'Likhanga', 'Muthokoi', 'Mukimo wa Njahi', 'Kimanga cha Ndizi',
    'Wukunu', 'Stewed Split Dal', 'Chick Peas Curry'
  ],
  Snacks: [
    'Kaimati', 'Mahamri', 'Mandazi', 'Samosa', 'Sambusa', 'Qita', 'Mkate Kuta', 'Vimumunya vya Sukari',
    'Potato Bhajia', 'Potato Chips'
  ]
};

function categorizeRecipe(recipeName) {
  for (const [category, dishes] of Object.entries(categories)) {
    if (dishes.some(dish => recipeName.toLowerCase().includes(dish.toLowerCase()))) {
      return category;
    }
  }
  return 'Uncategorized';
}

async function updateCategories() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    const recipes = await Recipe.find();
    let updatedCount = 0;

    for (const recipe of recipes) {
      const newCategory = categorizeRecipe(recipe.recipe_name);
      if (recipe.category !== newCategory) {
        recipe.category = newCategory;
        await recipe.save();
        updatedCount++;
      }
    }

    console.log(`Categories updated successfully. ${updatedCount} recipes were updated.`);
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateCategories();
