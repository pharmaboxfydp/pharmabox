import { User } from '../types/types'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'
import { Patient, Prescription } from '@prisma/client'

export interface FullPatient extends Patient {
  User: User
  Prescriptions: Prescription[]
}

export interface UsePatients {
  patients: FullPatient[] | null
  numPatients: number | null
  isLoading: boolean
  isError: Error
}

export type UserPagination = Record<string, string | string[] | undefined>

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; patients: FullPatient[]; numPatients: number }> =>
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

  return {
    patients: data?.patients ?? null,
    numPatients: data?.numPatients ?? null,
    isLoading: !error && !data,
    isError: error
  }
}
