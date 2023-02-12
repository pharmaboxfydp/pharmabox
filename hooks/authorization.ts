import { Role, User } from '../types/types'
import useSWR, { useSWRConfig } from 'swr'

export interface UseAuthorization {
  isAuthorized: boolean
  role: Role | null
  user: User | null
  isLoading: boolean
  isError: Error
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{
  message: string
  isAuthorized: boolean
  role: Role
  user: User
}> => fetch(...arg).then((res) => res.json())

export default function useAuthorization(user: User): UseAuthorization {
  const { mutate } = useSWRConfig()

  const { data, error } = useSWR(
    `/api/user/${user.role}/${user.id}/authorization/status`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false
    }
  )
  return {
    isAuthorized: data?.isAuthorized ?? false,
    role: data?.role ?? null,
    user: data?.user ?? null,
    isLoading: !error && !data,
    isError: error
  }
}
