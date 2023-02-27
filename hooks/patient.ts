import { User } from '../types/types'
import useSWR from 'swr'
import { Patient, Prescription } from '@prisma/client'

export interface PatientWithPrescriptionAndUser extends Patient {
  Prescriptions: Prescription[]
  User: User
}

export interface UsePatient {
  patient: PatientWithPrescriptionAndUser | null
  error: Error
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{
  message: string
  patient: PatientWithPrescriptionAndUser
}> => fetch(...arg).then((res) => res.json())

export default function usePatient(patientId: string): UsePatient {
  const url = `/api/patients/${patientId}`

  const { data, error } = useSWR(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  return {
    patient: data?.patient ?? null,
    error
  }
}
