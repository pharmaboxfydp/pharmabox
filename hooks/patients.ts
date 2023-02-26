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

export type UserSearch = {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}

export type UserPagination = {
  page: number
  step: number
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; patients: User[]; numPatients: number }> =>
  fetch(...arg).then((res) => res.json())

export default function usePatients({
  pagination,
  search
}: {
  pagination?: UserPagination
  search?: UserSearch
}): UsePatients {
  const hasPagination = pagination && pagination.page && pagination.step
  const hasFirstNameSearch = search?.firstName
  const hasLastNameSearch = search?.lastName
  const hasPhoneNumberSearch = search?.phoneNumber
  const hasEmailSearch = search?.email

  const url = `/api/patients/${`?${new URLSearchParams({
    ...(hasPagination && {
      take: pagination.step.toString(),
      page: pagination.page.toString()
    }),
    ...(hasFirstNameSearch && {
      firstName: search.firstName
    }),
    ...(hasLastNameSearch && {
      lastName: search.lastName
    }),
    ...(hasPhoneNumberSearch && {
      phoneNumber: search.phoneNumber
    }),
    ...(hasEmailSearch && {
      email: search.email
    })
  })}`}`

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
