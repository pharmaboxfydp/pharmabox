import { UserJSON } from '@clerk/backend-core'
import {
  Patient,
  Staff,
  Prescription,
  Location,
  LockerBox
} from '@prisma/client'

export enum Role {
  Staff = 'staff',
  Patient = 'patient'
}
export type PrescriptionAndLocation = Prescription & { Location: Location } & {
  LockerBox: LockerBox
}

export enum StaffRootPages {
  Home = '/home',
  Workflows = '/workflows',
  Patients = '/patients',
  Team = '/team',
  Logbook = '/logbook',
  Settings = '/settings/[[...index]]',
  Profile = '/settings/profile/[[...index]]'
}

export enum PatientRootPages {
  Home = '/home',
  Payments = '/payments',
  Notifications = '/notifications',
  Settings = '/settings/[[...index]]',
  Profile = '/settings/profile/[[...index]]'
}

export type User = {
  id: string
  firstName: string | undefined
  lastName: string | undefined
  email: string
  phoneNumber?: string
  pickup_enabled?: boolean
  role?: Role
  createdAt: string
  updatedAt: string
  Patient?: Patient
  Staff?: Staff
}

export interface ServerPageProps {
  user: User
  __clerk_ssr_state: UserJSON
}
