import { User } from '../types/types'
import useSWR, { useSWRConfig } from 'swr'

export interface AddTeamMember {
  email: string
  locationId: number
  isAdmin: boolean
}

export interface UseTeam {
  team: User[] | null
  isLoading: boolean
  isError: Error
  addTeamMember: ({ email, locationId, isAdmin }: AddTeamMember) => void
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; teamMembers: User[] }> =>
  fetch(...arg).then((res) => res.json())

export default function useTeam(user: User): UseTeam {
  const { mutate } = useSWRConfig()
  const { data, error } = useSWR(`/api/team/${user.Staff?.locationId}`, fetcher)

  async function addTeamMember({ email, locationId, isAdmin }: AddTeamMember) {
    const response = await fetch('/api/team/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        data: { email, locationId, isAdmin }
      })
    })
    if (response.status === 200) {
      const res = await response.json()
      mutate(`/api/team/${user.Staff?.locationId}`)
    }
  }

  return {
    team: data?.teamMembers ?? null,
    isLoading: !error && !data,
    isError: error,
    addTeamMember
  }
}
