import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query'
import api from '../lib/api'

interface Recipe {
  _id: string;
  recipe_name: string;
  image_url?: string;
  source?: string;
  url?: string;
  ingredients?: string[];
}

interface PageData {
  recipes: Recipe[];
  nextPage: number | null;
}

const fetchRecipes = async ({ pageParam = 0, searchTerm }: { pageParam: number, searchTerm: string }): Promise<PageData> => {
  const response = await api.get('/api/edamam-recipes', {
    params: {
      searchTerm,
      from: pageParam,
      to: pageParam + 9
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recipes: Recipe[] = response.data.hits.map((hit: any) => ({
    _id: hit.recipe.uri,
    recipe_name: hit.recipe.label,
    image_url: hit.recipe.image,
    source: hit.recipe.source,
    url: hit.recipe.url,
    ingredients: hit.recipe.ingredientLines,
  }));

  return {
    recipes,
    nextPage: response.data.more ? pageParam + 9 : null
  };
}

export function useRecipeSearch(searchTerm: string) {
  return useInfiniteQuery<PageData, Error, InfiniteData<PageData>, [string, string], number>({
    queryKey: ['recipes', searchTerm],
    queryFn: ({ pageParam }) => fetchRecipes({ pageParam, searchTerm }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!searchTerm,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
