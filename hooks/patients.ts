import { User } from '../types/types'
import useSWR, { mutate } from 'swr'
import { Patient, Prescription } from '@prisma/client'
import { toast } from 'react-toastify'

export interface FullPatient extends Patient {
  User: User[]
  Prescriptions: Prescription[]
}

export interface NewPatient {
  firstName: string
  lastName: string
  phone: string
  email: string
}

export interface UsePatients {
  patients: User[] | null
  activePatients: User[] | null
  numPatients: number | null
  isLoading: boolean
  isError: Error
  addPatient: (data: NewPatient) => Promise<{ message: string; user: User }>
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

  const activePatients =
    data?.patients.filter((u) => u.Patient?.pickupEnabled) ?? null

  return {
    patients: data?.patients ?? null,
    numPatients: data?.numPatients ?? null,
    activePatients,
    isLoading: !error && !data,
    isError: error,
    addPatient
  }
}
