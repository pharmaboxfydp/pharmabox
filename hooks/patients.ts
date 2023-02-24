import { User } from '../types/types'
import useSWR, { mutate, useSWRConfig } from 'swr'
import { toast } from 'react-toastify'
import { Patient, Prescription } from '@prisma/client'

export interface FullPatient extends User {
  Patient: Patient
}

export interface NewPatient {
  firstName: string
  lastName: string
  phone: string
  email: string
}

export interface UsePatients {
  patients: FullPatient[] | null
  activePatients: FullPatient[] | null
  numPatients: number | null
  isLoading: boolean
  isError: Error
  addPatient: (data: NewPatient) => Promise<{ message: string; user: User }>
}

export type UserPagination = Record<string, string | string[] | undefined>
export type UserSearch = string
export interface UsePatientsInterface {
  pagination?: UserPagination
  search?: UserSearch
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; patients: FullPatient[]; numPatients: number }> =>
  fetch(...arg).then((res) => res.json())

export default function usePatients({
  pagination,
  search
}: UsePatientsInterface): UsePatients {
  const hasPagination = pagination && pagination?.step && pagination?.page
  const paginationSearch = {
    take: pagination?.step?.toString(),
    page: pagination?.page?.toString()
  }
  const hasSearch = search?.length

  const url = `/api/patients/${`?${new URLSearchParams({
    ...(hasPagination && paginationSearch),
    ...(hasSearch && { search: search })
  })}`}`

  const { data, error } = useSWR(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  const activePatients =
    data?.patients?.filter((patient) => patient.Patient.pickupEnabled) ?? null

  async function addPatient({
    firstName,
    lastName,
    email: email,
    phone
  }: NewPatient): Promise<{ message: 'string'; user: User }> {
    const response = await fetch('/api/patients/create', {
      method: 'POST',
      body: JSON.stringify({
        data: { firstName, lastName, email, phone }
      })
    })
    const res = await response.json()

    if (response.status === 200) {
      toast.success(`Added Patient: ${firstName} ${lastName}`, { icon: '👍' })
      mutate(url)
    } else {
      toast.error(res.message, { icon: '😥' })
      mutate(url)
    }
    return res
  }

  return {
    patients: data?.patients ?? null,
    numPatients: data?.numPatients ?? null,
    activePatients,
    isLoading: !error && !data,
    isError: error,
    addPatient
  }
}
