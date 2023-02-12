import { Pharmacist, Staff } from '@prisma/client'
import { toast } from 'react-toastify'
import { useSWRConfig } from 'swr'
import { Permissions, Role } from '../types/types'

export default function usePermissions() {
  const { mutate } = useSWRConfig()

  async function updatePermissions({
    value,
    member,
    role
  }: {
    value: string
    member: Staff | Pharmacist
    role: Role
  }) {
    const response = await fetch(
      `/api/${role === Role.Staff ? 'staff' : 'pharmacist'}/update/permissions`,
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            userId: member.userId,
            isAdmin: value === Permissions.Admin ? true : false
          }
        })
      }
    )
    if (response.status === 200) {
      await response.json()
      toast.success(`Updated to ${value}`, { icon: '👍' })
      mutate(`/api/team/${member.locationId}`)
    } else {
      toast.error('Unable to update permissions', { icon: '😥' })
      mutate(`/api/team/${member.locationId}`)
    }
  }
  return {
    updatePermissions
  }
}
