import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Article {
  title: string;
  url: string;
  source: string;
}

const fetchArticles = async (searchTerm: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  if (!API_KEY) {
    throw new Error('News API key is not set');
  }
  const response = await axios.get<{ articles: Article[] }>('https://newsapi.org/v2/everything', {
    params: {
      apiKey: API_KEY,
      q: `(${searchTerm} AND (recipe OR dish OR cuisine))`,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 5,
      domains: 'foodnetwork.com,allrecipes.com,epicurious.com,bonappetit.com,seriouseats.com'
    }
  })
  return response.data.articles
}

export function useArticleFetch(searchTerm: string) {
  return useQuery({
    queryKey: ['articles', searchTerm],
    queryFn: () => fetchArticles(searchTerm),
    enabled: !!searchTerm,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
