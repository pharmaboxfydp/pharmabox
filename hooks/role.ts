import { Pharmacist, Staff, User } from '@prisma/client'
import { capitalize } from 'lodash'
import { toast } from 'react-toastify'
import { useSWRConfig } from 'swr'
import { Role } from '../types/types'

export default function useRole() {
  const { mutate } = useSWRConfig()

  async function updateRole({
    role,
    member
  }: {
    role: Role
    member: Staff | Pharmacist
  }) {
    const { userId, isAdmin, locationId } = member

    const response = await fetch(`/api/user/update/role`, {
      method: 'POST',
      body: JSON.stringify({
        data: {
          id: userId,
          role,
          isAdmin,
          locationId
        }
      })
    })
    if (response.status === 200) {
      await response.json()
      toast.success(`Updated to ${capitalize(role)}`, { icon: '👍' })
      mutate(`/api/team/${locationId}`)
    } else {
      toast.error('Unable to update role', { icon: '😥' })
      mutate(`/api/team/${locationId}`)
    }
  }

  return {
    updateRole
  }
}
