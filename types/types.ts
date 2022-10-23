export enum Role {
  Staff = 'STAFF',
  Patient = 'PATIENT'
}

export type User = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  phone?: string
  banned: boolean
  pickup_enabled?: boolean
  role?: Role
  dob?: string
  createdAt: string
  updatedAt: string
}
