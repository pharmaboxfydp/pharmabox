import { UserJSON } from '@clerk/backend-core'
import {
  Patient,
  Staff,
  Prescription,
  Location,
  LockerBox,
  Pharmacist
} from '@prisma/client'
import { PatientWithPrescriptionAndUser } from '../hooks/patient'

export enum Role {
  Staff = 'staff',
  Patient = 'patient',
  Pharmacist = 'pharmacist'
}
export interface PrescriptionAndLocationAndPatient extends Prescription {
  readonly Location: Location
  readonly LockerBox: LockerBox
  readonly Patient: PatientWithPrescriptionAndUser
}

export interface StaffWithUser extends Staff {
  User: User
}

export interface PharmacistWithUser extends Pharmacist {
  User: User
}

export interface PrescriptionAndLocationAndPatientAndStaffAndPharmacist
  extends PrescriptionAndLocationAndPatient,
    Prescription {
  readonly Staff: StaffWithUser
  readonly Pharmacist: PharmacistWithUser
}

export type PharmacyLocation = Location & {
  readonly Prescriptions: Prescription[]
} & {
  readonly LockerBoxes: LockerBox[]
}

export enum Permissions {
  Standard = 'Standard',
  Admin = 'Admin'
}
export enum Status {
  AwaitingPickup = 'AwaitingPickup',
  PickupCompleted = 'PickupCompleted'
}

export enum LockerBoxState {
  empty = 'empty',
  full = 'full'
}

export enum StaffRootPages {
  Home = '/home',
  Workflows = '/workflows',
  Patients = '/patients',
  Team = '/team',
  Logbook = '/logbook',
  Settings = '/settings/[[...index]]',
  Profile = '/settings/profile/[[...index]]',
  Patient = '/patients/[patientId]',
  PatientEdit = '/patients/[patientId]/edit'
}

export enum PatientRootPages {
  Home = '/home',
  Payments = '/payments',
  Settings = '/settings/[[...index]]',
  Profile = '/settings/profile/[[...index]]'
}

export enum PharmacistRootPages {
  Home = '/home',
  Workflows = '/workflows',
  Patients = '/patients',
  Team = '/team',
  Logbook = '/logbook',
  Settings = '/settings/[[...index]]',
  Profile = '/settings/profile/[[...index]]',
  Patient = '/patients/[patientId]',
  PatientEdit = '/patients/[patientId]/edit'
}

export type User = {
  readonly id: string
  readonly firstName: string | undefined
  readonly lastName: string | undefined
  readonly email: string
  readonly phoneNumber?: string
  readonly pickup_enabled?: boolean
  readonly role?: Role
  readonly createdAt: string
  readonly updatedAt: string
  readonly lastLoggedIn?: string
  Patient?: Patient
  Staff?: Staff
  Pharmacist?: Pharmacist
}

export interface ServerPageProps {
  readonly user: UserWithPrescriptionsAndAuthorizer
  __clerk_ssr_state: UserJSON
}

export interface PharmacistWithPrescriptions extends Pharmacist {
  Prescription: Prescription[]
}

export interface StaffWithPrescriptionsAndAuthorizer extends Staff {
  Prescription: Prescription[]
  authorizer: { User: User }
}

export interface UserWithPrescriptionsAndAuthorizer extends User {
  Pharmacist: PharmacistWithPrescriptions
  Staff: StaffWithPrescriptionsAndAuthorizer
}
