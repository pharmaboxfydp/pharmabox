import useSWR from 'swr'

export interface UseClerkUser {
  user: { profile_image_url: string } | null
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; user: { profile_image_url: string } }> =>
  fetch(...arg).then((res) => res.json())

export default function useClerkUser(userId: string): UseClerkUser {
  /**
   * we will automatically handle an error here from useSWR if locationId is null
   */
  const { data, error } = useSWR(`/api/user/clerk/${userId}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  return {
    user: data?.user ?? null
  }
}
