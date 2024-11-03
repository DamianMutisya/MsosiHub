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

export function useRecipeSearch(searchTerm: string) {
  return useInfiniteQuery<PageData, Error, InfiniteData<PageData>, [string, string], number>({
    queryKey: ['recipes', searchTerm],
    queryFn: async ({ pageParam }) => {
      try {
        const response = await api.get(`/api/recipes/${encodeURIComponent(searchTerm)}`, {
          params: {
            from: pageParam,
            to: pageParam + 9
          }
        });

        return {
          recipes: response.data || [],
          nextPage: response.data?.length === 10 ? pageParam + 9 : null
        };
      } catch (error) {
        console.error('Recipe search error:', error);
        return {
          recipes: [],
          nextPage: null
        };
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!searchTerm,
    staleTime: 5 * 60 * 1000,
  });
}
