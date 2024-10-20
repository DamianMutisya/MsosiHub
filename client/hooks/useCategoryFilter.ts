import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchCategories = async () => {
  const response = await axios.get<string[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
  return response.data
}

export function useCategoryFilter() {
  return useQuery<string[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}
