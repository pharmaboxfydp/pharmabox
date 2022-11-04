import { Staff } from '@prisma/client'
import { toast } from 'react-toastify'
import { useSWRConfig } from 'swr'
import { Permissions } from '../types/types'

export default function useRole() {
  const { mutate } = useSWRConfig()

  async function updateRole({
    value,
    member
  }: {
    value: string
    member: Staff
  }) {
    const response = await fetch('/api/staff/update/permissions', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          userId: member.userId,
          isAdmin: value === Permissions.Admin ? true : false
        }
      })
    })
    if (response.status === 200) {
      await response.json()
      toast.success(`Updated to ${value}`, { icon: '👍' })
      mutate('/api/team')
    } else {
      toast.error('Unable to update role', { icon: '😥' })
    }
  }
  return {
    updateRole
  }
}
