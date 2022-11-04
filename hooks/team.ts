import { User } from '../types/types'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'

export interface AddTeamMember {
  email: string
  locationId: number
  isAdmin: boolean
}

export interface UseTeam {
  team: User[] | null
  isLoading: boolean
  isError: Error
  addTeamMember: ({ email, locationId, isAdmin }: AddTeamMember) => Promise<{
    message: string
    existingUser: boolean
    emailInvite?: Record<string, any>
    staffUser?: User
    error?: Error
  }>
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; teamMembers: User[] }> =>
  fetch(...arg).then((res) => res.json())

export default function useTeam(user: User): UseTeam {
  const { mutate } = useSWRConfig()
  const { data, error } = useSWR(
    `/api/team/${user.Staff?.locationId}`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false
    }
  )

  async function addTeamMember({ email, locationId, isAdmin }: AddTeamMember) {
    const response = await fetch('/api/team/members/invite', {
      method: 'POST',
      body: JSON.stringify({
        data: { email, locationId, isAdmin }
      })
    })
    if (response.status === 200) {
      mutate(`/api/team/${user.Staff?.locationId}`)
      toast.success(`Invite sent to ${email}`, { icon: '✨' })
    } else {
      toast.error('Unable to invite user', { icon: '❌' })
    }
    const res = await response.json()
    return res
  }

  return {
    team: data?.teamMembers ?? null,
    isLoading: !error && !data,
    isError: error,
    addTeamMember
  }
}
