import { Location } from '@prisma/client'
import useSWR from 'swr'
import { User } from '../types/types'

export interface UseLocation {
  location: Location
  isLoading: boolean
  isError: boolean
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; location: Location }> =>
  fetch(...arg).then((res) => res.json())

export default function useLocation(user: User) {
  const { data, error } = useSWR(
    `/api/locations/${user.Staff?.locationId}`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false
    }
  )

  return {
    location: data?.location ?? null,
    isLoading: !error && !data,
    isError: error
  }
}
