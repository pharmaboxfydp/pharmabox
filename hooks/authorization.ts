import { Role, StaffWithPrescriptionsAndAuthorizer, User } from '../types/types'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'

export interface GrantOrRevokeAuthorization {
  targetUserId: string
  targetUserRole: Role
}

export interface UseAuthorization {
  isAuthorized: boolean
  role: Role | null
  user: StaffWithPrescriptionsAndAuthorizer | null
  isLoading: boolean
  isError: Error
  grantAuthorization: ({
    targetUserId,
    targetUserRole
  }: GrantOrRevokeAuthorization) => Promise<void>
  revokeAuthorization: ({
    targetUserId,
    targetUserRole
  }: GrantOrRevokeAuthorization) => Promise<void>
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{
  message: string
  isAuthorized: boolean
  role: Role
  user: StaffWithPrescriptionsAndAuthorizer
}> => fetch(...arg).then((res) => res.json())

export default function useAuthorization(user: User): UseAuthorization {
  const member = user.Pharmacist ? user.Pharmacist : user.Staff
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

  async function grantAuthorization({
    targetUserId,
    targetUserRole
  }: GrantOrRevokeAuthorization) {
    const response = await fetch(
      `/api/user/${targetUserRole}/${targetUserId}/authorization/grant`,
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            authorizerUserId: user.id
          }
        })
      }
    )
    if (response.status === 200) {
      await response.json()
      mutate(`/api/team/${member?.locationId}`)
      mutate(`/api/user/${user.role}/${user.id}/authorization/status`)
    } else {
      toast.error('Unable to activate', { icon: '😥' })
      mutate(`/api/team/${member?.locationId}`)
      mutate(`/api/user/${user.role}/${user.id}/authorization/status`)
    }
  }

  async function revokeAuthorization({
    targetUserId,
    targetUserRole
  }: GrantOrRevokeAuthorization) {
    const response = await fetch(
      `/api/user/${targetUserRole}/${targetUserId}/authorization/revoke`,
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            authorizerUserId: user.id
          }
        })
      }
    )
    if (response.status === 200) {
      await response.json()
      mutate(`/api/team/${member?.locationId}`)
      mutate(`/api/user/${user.role}/${user.id}/authorization/status`)
    } else {
      toast.error('Unable to update activation status', { icon: '😥' })
      mutate(`/api/team/${member?.locationId}`)
      mutate(`/api/user/${user.role}/${user.id}/authorization/status`)
    }
  }
  return {
    isAuthorized: data?.isAuthorized ?? false,
    role: data?.role ?? null,
    user: data?.user ?? null,
    isLoading: !error && !data,
    isError: error,
    grantAuthorization,
    revokeAuthorization
  }
}
