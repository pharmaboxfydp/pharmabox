import { UserJSON } from '@clerk/backend-core'

export enum Role {
  Staff = 'STAFF',
  Patient = 'PATIENT'
}

export enum StaffRootPages {
  Home = '/',
  Workflows = '/workflows',
  Patients = '/patients',
  Team = '/team',
  Logbook = '/logbook',
  Settings = '/settings'
}

export enum PatientRootPages {
  Home = '/',
  Payments = '/payments',
  Notifications = '/notifications',
  Settings = '/settings'
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

export interface ServerPageProps {
  user: User
  __clerk_ssr_state: UserJSON
}
