import { User } from '../types/types'
import useSWR from 'swr'

export interface UseTeam {
  team: User[] | null
  isLoading: boolean
  isError: Error
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; teamMembers: User[] }> =>
  fetch(...arg).then((res) => res.json())

export default function useTeam(user: User): UseTeam {
  const { data, error } = useSWR(`/api/team/${user.Staff?.locationId}`, fetcher)

  async function addTeamMember({
    email,
    locationId,
    isAdmin
  }: {
    email: string
    locationId: number
    isAdmin: boolean
  }) {}

  return {
    team: data?.teamMembers ?? null,
    isLoading: !error && !data,
    isError: error
  }
}
