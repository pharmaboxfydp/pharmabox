import { User } from '../types/types'
import useSWR from 'swr'
import { Patient, Prescription } from '@prisma/client'

export interface FullPatient extends Patient {
  User: User[]
  Prescriptions: Prescription[]
}

export interface UsePatients {
  patients: User[] | null
  activePatients: User[] | null
  numPatients: number | null
  isLoading: boolean
  isError: Error
}

export type UserPagination = Record<string, string | string[] | undefined>

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; patients: User[]; numPatients: number }> =>
  fetch(...arg).then((res) => res.json())

export default function usePatients(pagination?: UserPagination): UsePatients {
  const url = `/api/patients/${
    pagination && pagination?.step && pagination?.page
      ? `?${new URLSearchParams({
          take: pagination.step.toString(),
          page: pagination.page.toString()
        })}`
      : ''
  }`

  const { data, error } = useSWR(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  const activePatients =
    data?.patients.filter((u) => u.Patient?.pickupEnabled) ?? null

  return {
    patients: data?.patients ?? null,
    numPatients: data?.numPatients ?? null,
    activePatients,
    isLoading: !error && !data,
    isError: error
  }
}
