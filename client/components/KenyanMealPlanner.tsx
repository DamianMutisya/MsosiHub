import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Calendar, Printer, Share2, Mail } from 'lucide-react'
import { AlertDialog } from "@/components/ui/alert-dialog"
import { useAuth } from '../context/AuthContext'

const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

type DayOfWeek = typeof daysOfWeek[number]
type MealCategory = typeof mealCategories[number]

interface Dish {
  _id: string;
  recipe_name: string;
  category: string;
}

type MealPlan = {
  _id: string;
  userId: string;
  mealPlan: {
    [key in DayOfWeek]?: {
      [key in MealCategory]?: string;
    };
  };
  createdAt: string;
};

const fetchKenyanDishes = async (category?: string): Promise<Dish[]> => {
  try {
    const response = await axios.get<Dish[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
      params: category ? { category } : {}
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching Kenyan dishes:', error);
    throw error;
  }
}

const fetchIngredients = async (dishName: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/ingredients/${encodeURIComponent(dishName)}`);
    return response.data.ingredients || []; // Ensure it returns an empty array if undefined
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

export default function KenyanMealPlanner() {
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan['mealPlan']>({});
  const [categoryDishes, setCategoryDishes] = useState<Dish[]>([])
  //const [] = useState<string>('');
  //const [] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  //const [] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedMealPlans, setSavedMealPlans] = useState<MealPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [isShoppingListModalOpen, setIsShoppingListModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; description: string }>>([]);

  const CustomToast = ({ id, title, description }: { id: string; title: string; description: string }) => (
    <div 
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm"
      id={`toast-${id}`}
    >
      <h4 className="font-bold">{title}</h4>
      <p>{description}</p>
    </div>
  );

  useEffect(() => {
    // Fetch all dishes when the component mounts
    fetchDishesForCategory('');
    fetchSavedMealPlans();
  }, []);

  useEffect(() => {
    console.log('Current meal plan:', mealPlan);
  }, [mealPlan]);

  useEffect(() => {
    console.log('Saved meal plans:', savedMealPlans);
  }, [savedMealPlans]);

  const addMeal = (day: DayOfWeek, category: MealCategory, dish: string) => {
    setMealPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [category]: dish
      }
    }));
    setIsModalOpen(false);
  }

  const fetchDishesForCategory = async (category: MealCategory | '') => {
    setIsLoading(true);
    setError(null);
    try {
      const dishes = await fetchKenyanDishes(category);
      console.log(`Fetched ${dishes.length} dishes for category ${category || 'all'}`);
      setCategoryDishes(dishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setError('Failed to fetch dishes. Please try again.');
      setCategoryDishes([]);
    } finally {
      setIsLoading(false);
    }
  }

  const openDishSelector = (day: DayOfWeek, category: MealCategory) => {
    setSelectedDay(day);
    setSelectedCategory(category);
    fetchDishesForCategory(category);
    setIsModalOpen(true);
  };

  const saveMealPlan = async () => {
    try {
      if (!user) {
        addToast({
          title: "Error",
          description: "You must be logged in to save a meal plan."
        });
        return;
      }

      const endpoint = currentPlanId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans/${currentPlanId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans`;
      
      const method = currentPlanId ? 'put' : 'post';
      
      const response = await axios[method](endpoint, {
        userId: user.userId,
        mealPlan: mealPlan
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      addToast({
        title: "Success",
        description: "Meal plan saved successfully"
      });
      
      fetchSavedMealPlans(); // Refresh the list of saved meal plans
      setCurrentPlanId(response.data._id); // Set the current plan ID to the newly saved or updated plan
    } catch (error) {
      console.error('Error saving meal plan:', error);
      addToast({
        title: "Error",
        description: "Failed to save meal plan. Please try again."
      });
    }
  }

  const fetchSavedMealPlans = async () => {
    try {
      if (!user) {
        console.error('User not logged in');
        return;
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSavedMealPlans(response.data);
    } catch (error) {
      console.error('Error fetching saved meal plans:', error);
      addToast({
        title: "Error",
        description: "Failed to fetch saved meal plans. Please try again."
      });
    }
  };

  const loadMealPlan = (plan: MealPlan) => {
    setMealPlan(plan.mealPlan || {});
    setCurrentPlanId(plan._id);
    addToast({
      title: "Success",
      description: "Meal plan loaded successfully!"
    });
  };

  const createNewMealPlan = () => {
    setMealPlan({});
    setCurrentPlanId(null);
    addToast({
      title: "New Plan",
      description: "Started a new meal plan."
    });
  };

  const generateShoppingList = async () => {
    const shoppingList: { [key: string]: number } = {};

    try {
      for (const day in mealPlan) {
        const dayPlan = mealPlan[day as DayOfWeek];
        if (dayPlan) {
          for (const category in dayPlan) {
            const dishName = dayPlan[category as MealCategory];
            if (dishName) {
              const ingredients = await fetchIngredients(dishName);
              ingredients.forEach(ingredient => {
                const parts = ingredient.split(' ');
                if (parts.length >= 3) {
                  const [amount, unit, ...nameParts] = parts;
                  const name = nameParts.join(' ');
                  const key = `${unit} ${name}`;
                  const numericAmount = parseFloat(amount);
                  if (!isNaN(numericAmount)) {
                    shoppingList[key] = (shoppingList[key] || 0) + numericAmount;
                  }
                }
              });
            }
          }
        }
      }

      // Convert the shopping list object to an array of strings
      const formattedList = Object.entries(shoppingList).map(([item, amount]) => `${amount} ${item}`);

      // Display the shopping list
      setShoppingList(formattedList);
      setIsShoppingListModalOpen(true);
    } catch (error) {
      console.error('Error generating shopping list:', error);
      addToast({
        title: "Error",
        description: "Failed to generate shopping list. Please try again."
      });
    }
  };

  const exportToCalendar = async () => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Kenyan Meal Planner//EN\n';
    const startDate = new Date(); // Assuming we want to start from today

    for (const day in mealPlan) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + daysOfWeek.indexOf(day as DayOfWeek));

      for (const category in mealPlan[day as DayOfWeek]) {
        const meal = mealPlan[day as DayOfWeek]?.[category as MealCategory];
        if (meal) {
          try {
            const ingredients = await fetchIngredients(meal);
            icsContent += 'BEGIN:VEVENT\n';
            icsContent += `DTSTART:${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
            icsContent += `SUMMARY:${category} - ${meal}\n`;
            icsContent += `DESCRIPTION:${category} meal: ${meal}\\n\\nIngredients: ${ingredients.join(', ')}\\n\\nCooking instructions: (Add instructions here)\n`;
            icsContent += `UID:${Date.now()}@kenyanmealplanner.com\n`;
            icsContent += 'END:VEVENT\n';
          } catch (error) {
            console.error(`Error fetching ingredients for ${meal}:`, error);
            // You might want to add some user-facing error handling here
          }
        }
      }
    }

    icsContent += 'END:VCALENDAR';

    // Create a Blob with the ICS content
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'meal_plan.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printMealPlan = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <h1>Kenyan Weekly Meal Plan</h1>
      ${Object.entries(mealPlan).map(([day, meals]) => `
        <h2>${day}</h2>
        <ul>
          ${Object.entries(meals || {}).map(([category, meal]) => `
            <li>${category}: ${meal}</li>
          `).join('')}
        </ul>
      `).join('')}
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent.innerHTML);
    printWindow?.document.close();
    printWindow?.print();
  };

  const shareMealPlan = (method: 'whatsapp' | 'email') => {
    const mealPlanText = JSON.stringify(mealPlan, null, 2);
    const encodedMealPlan = encodeURIComponent(mealPlanText);

    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedMealPlan}`, '_blank');
    } else if (method === 'email') {
      window.location.href = `mailto:?subject=My Kenyan Meal Plan&body=${encodedMealPlan}`;
    }

    addToast({
      title: "Success",
      description: `Meal plan shared via ${method}.`
    });
  };

  const handleExport = async (value: string) => {
    try {
      switch (value) {
        case 'ics':
          await exportToCalendar();
          break;
        case 'print':
          printMealPlan();
          break;
        case 'whatsapp':
          shareMealPlan('whatsapp');
          break;
        case 'email':
          shareMealPlan('email');
          break;
        default:
          await exportToCalendar();
      }
    } catch (error) {
      console.error('Error exporting/sharing meal plan:', error);
      addToast({
        title: "Error",
        description: "Failed to export/share meal plan. Please try again."
      });
    }
  };

  const deleteMealPlan = async () => {
    if (!currentPlanId) {
      addToast({
        title: "Error",
        description: "No meal plan selected for deletion."
      });
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/meal-plans/${currentPlanId}`);
      addToast({
        title: "Success",
        description: "Meal plan deleted successfully"
      });
      setCurrentPlanId(null);
      setMealPlan({});
      fetchSavedMealPlans();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      addToast({
        title: "Error",
        description: "Failed to delete meal plan. Please try again."
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const addToast = (toast: { title: string; description: string }) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    fetchSavedMealPlans();
  }, [fetchSavedMealPlans]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold">My Weekly Meal Planner</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={createNewMealPlan}>New Plan</Button>
          <Button onClick={saveMealPlan}>Save Plan</Button>
          <Button onClick={deleteMealPlan} disabled={!currentPlanId}>Delete Plan</Button>
          <Button onClick={generateShoppingList}>Generate Shopping List</Button>
          <Button onClick={() => handleExport('ics')} title="Export to Calendar">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleExport('print')} title="Print Meal Plan">
            <Printer className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleExport('whatsapp')} title="Share via WhatsApp">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleExport('email')} title="Share via Email">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="Monday" className="w-full">
        <TabsList className="grid grid-cols-7 w-full">
          {daysOfWeek.map(day => (
            <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
              {day.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        {daysOfWeek.map(day => (
          <TabsContent key={day} value={day}>
            <Card>
              <CardHeader>
                <CardTitle>{day}&apos;s Kenyan Meal Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mealCategories.map(category => (
                    <div key={category} className="bg-secondary p-4 rounded-lg min-h-[200px] flex flex-col justify-between">
                      <h3 className="font-semibold mb-2">{category}</h3>
                      {mealPlan[day]?.[category] ? (
                        <div className="flex flex-col justify-between flex-grow">
                          <p>{mealPlan[day]![category]}</p>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => openDishSelector(day, category)}
                          >
                            Change {category}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-grow flex items-end">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => openDishSelector(day, category)}
                          >
                            Add {category}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && selectedCategory ? (
                mealPlan[selectedDay as DayOfWeek]?.[selectedCategory as MealCategory] 
                  ? `Change ${selectedCategory} for ${selectedDay}` 
                  : `Add ${selectedCategory} for ${selectedDay}`
              ) : (
                'Select a Dish'
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[50vh] w-full pr-4">
            <div className="grid gap-4">
              {isLoading ? (
                <p>Loading dishes...</p>
              ) : categoryDishes.length > 0 ? (
                categoryDishes.map((dish) => (
                  <Button 
                    key={dish._id} 
                    onClick={() => addMeal(selectedDay as DayOfWeek, selectedCategory as MealCategory, dish.recipe_name)} 
                    variant="outline" 
                    className="justify-start w-full text-left"
                  >
                    {dish.recipe_name}
                  </Button>
                ))
              ) : (
                <p>No dishes found for {selectedCategory}</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Saved Meal Plans</h3>
        {savedMealPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedMealPlans.map((plan, index) => (
              <Card key={index} className="p-4">
                <CardHeader>
                  <CardTitle>Meal Plan {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Created: {new Date(plan.createdAt).toLocaleDateString()}</p>
                </CardContent>
                <CardFooter className="space-x-2">
                  <Button onClick={() => loadMealPlan(plan)}>Load Plan</Button>
                  <Button onClick={() => {
                    loadMealPlan(plan);
                    setCurrentPlanId(plan._id);
                  }}>Edit Plan</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>No saved meal plans found.</p>
        )}
      </div>
      <Dialog open={isShoppingListModalOpen} onOpenChange={setIsShoppingListModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Shopping List</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[50vh] w-full pr-4">
            <ul className="list-disc pl-5">
              {shoppingList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete your meal plan."
        confirmText="Delete"
        cancelText="Cancel"
      />
      {toasts.map(toast => (
        <CustomToast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
