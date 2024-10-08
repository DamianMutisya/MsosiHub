import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Share2, ThumbsUp, Send } from 'lucide-react'

type Discussion = {
  id: string
  title: string
  author: string
  content: string
  replies: number
  likes: number
  date: string
}

type SharedRecipe = {
  id: string
  title: string
  author: string
  description: string
  likes: number
  date: string
}

type FAQItem = {
  question: string
  answer: string
}

const initialDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Best ugali technique?',
    author: 'Jane Doe',
    content: "I'm trying to perfect my ugali. Any tips on getting the right consistency?",
    replies: 5,
    likes: 12,
    date: '2023-09-15'
  },
  {
    id: '2',
    title: 'Sourcing authentic Kenyan spices',
    author: 'John Smith',
    content: 'Where can I find authentic Kenyan spices in the US?',
    replies: 3,
    likes: 8,
    date: '2023-09-14'
  }
]

const initialSharedRecipes: SharedRecipe[] = [
  {
    id: '1',
    title: "Mama's Chapati Recipe",
    author: 'Alice Johnson',
    description: "The fluffiest chapati you'll ever taste!",
    likes: 25,
    date: '2023-09-13'
  },
  {
    id: '2',
    title: 'Spicy Kenyan Beef Stew',
    author: 'Bob Williams',
    description: 'A hearty stew perfect for cold evenings.',
    likes: 18,
    date: '2023-09-12'
  }
]

const faqItems: FAQItem[] = [
  {
    question: 'How do I share my recipe?',
    answer: 'To share your recipe, go to the "My Recipes" section, select the recipe you want to share, and click on the "Share" button. You can then choose to share it publicly in the community or send a private link to friends.'
  },
  {
    question: 'Can I edit a recipe I\'ve shared?',
    answer: 'Yes, you can edit your shared recipes. Go to "My Recipes", find the shared recipe, make your changes, and click "Update". The shared version will be automatically updated in the community section.'
  },
  {
    question: 'How do I convert measurements?',
    answer: 'We have a built-in conversion tool in the recipe viewer. When viewing a recipe, click on the "Convert" button and choose your preferred measurement system.'
  },
  {
    question: 'Is there a way to save recipes from other users?',
    answer: 'When browsing shared recipes in the community section, you\'ll see a "Save" button on each recipe card. Clicking this will add the recipe to your personal collection.'
  }
]

export default function CommunityAndHelp() {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions)
  const [sharedRecipes, setSharedRecipes] = useState<SharedRecipe[]>(initialSharedRecipes)
  const { addToast } = useToast()

  const addDiscussion = (newDiscussion: Discussion) => {
    setDiscussions([newDiscussion, ...discussions])
    addToast({
      title: "Discussion Posted",
      description: "Your discussion has been added to the community board.",
    })
  }

  const addSharedRecipe = (newRecipe: SharedRecipe) => {
    setSharedRecipes([newRecipe, ...sharedRecipes])
    addToast({
      title: "Recipe Shared",
      description: "Your recipe has been shared with the community.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Community & Help</h1>
      
      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="shared-recipes">Shared Recipes</TabsTrigger>
          <TabsTrigger value="help">Help & FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Community Discussions</h2>
            <NewDiscussionDialog onAddDiscussion={addDiscussion} />
          </div>
          <div className="space-y-4">
            {discussions.map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shared-recipes">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Shared Recipes</h2>
            <NewSharedRecipeDialog onAddSharedRecipe={addSharedRecipe} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedRecipes.map(recipe => (
              <SharedRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="help">
          <h2 className="text-2xl font-semibold mb-6">Help & FAQ</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="border rounded-lg">
                <summary className="px-4 py-2 cursor-pointer font-medium bg-gray-50 hover:bg-gray-100">
                  {item.question}
                </summary>
                <p className="px-4 py-2">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Need more help?</h3>
            <ContactForm />
          </div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

function DiscussionCard({ discussion }: { discussion: Discussion }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{discussion.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={discussion.author} />
            <AvatarFallback>{discussion.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-500">{discussion.author}</span>
          <span className="text-sm text-gray-500 ml-auto">{discussion.date}</span>
        </div>
        <p className="text-sm mb-4">{discussion.content}</p>
        <div className="flex items-center text-sm text-gray-500">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span className="mr-4">{discussion.replies} replies</span>
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>{discussion.likes} likes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Discussion</Button>
      </CardFooter>
    </Card>
  )
}

function SharedRecipeCard({ recipe }: { recipe: SharedRecipe }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={recipe.author} />
            <AvatarFallback>{recipe.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-500">{recipe.author}</span>
          <span className="text-sm text-gray-500 ml-auto">{recipe.date}</span>
        </div>
        <p className="text-sm mb-4">{recipe.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>{recipe.likes} likes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Recipe</Button>
      </CardFooter>
    </Card>
  )
}

function NewDiscussionDialog({ onAddDiscussion }: { onAddDiscussion: (discussion: Discussion) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      title,
      author: 'Current User', // In a real app, this would be the logged-in user
      content,
      replies: 0,
      likes: 0,
      date: new Date().toISOString().split('T')[0]
    }
    onAddDiscussion(newDiscussion)
    setIsOpen(false)
    setTitle('')
    setContent('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          New Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts or questions with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3 w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3 w-full p-2 border rounded"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Post Discussion</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function NewSharedRecipeDialog({ onAddSharedRecipe }: { onAddSharedRecipe: (recipe: SharedRecipe) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRecipe: SharedRecipe = {
      id: Date.now().toString(),
      title,
      author: 'Current User', // In a real app, this would be the logged-in user
      description,
      likes: 0,
      date: new Date().toISOString().split('T')[0]
    }
    onAddSharedRecipe(newRecipe)
    setIsOpen(false)
    setTitle('')
    setDescription('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share a Recipe</DialogTitle>
          <DialogDescription>
            Share your favorite recipe with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3 w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 w-full p-2 border rounded"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Share Recipe</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { addToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message to a backend
    console.log('Contact form submitted:', { name, email, message })
    addToast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon.",
    })
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>
      <Button type="submit">
        <Send className="mr-2 h-4 w-4" />
        Send Message
      </Button>
    </form>
  )
}