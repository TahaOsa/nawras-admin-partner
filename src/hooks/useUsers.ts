import { useQuery } from '@tanstack/react-query'
import { config } from '@/lib/config'

interface User {
  user_id: string
  name: string
  email: string
  created_at: string
  updated_at: string | null
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch(`${config.apiBaseUrl}/api/users`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }
      
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
} 