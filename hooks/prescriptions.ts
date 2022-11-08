import { Location, Prescription } from '@prisma/client'
import useSWR from 'swr'
import { Status, User } from '../types/types'

export interface UsePatientPrescriptions {
  prescriptions: Prescription[] | null
  activePrescriptions: Prescription[] | null
  prevPrescriptions: Prescription[] | null
  isLoading: boolean
  isError: boolean
}

export interface UsePrescription {
  prescription: Prescription | null
  isLoading: boolean
  isError: boolean
}

const fetcher = <T>(...arg: [string, Record<string, any>]): Promise<T> =>
  fetch(...arg).then((res) => res.json())

export function usePatientPrescriptions(user: User): UsePatientPrescriptions {
  const { data, error } = useSWR<{
    message: string
    prescriptions: Prescription[]
  }>(`/api/prescriptions/patient/${user.Patient?.id}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  const activePrescriptions =
    data?.prescriptions.filter(
      (prescription) => prescription.status === Status.AwaitingPickup
    ) ?? null

  const prevPrescriptions =
    data?.prescriptions.filter(
      (prescription) => prescription.status === Status.PickupCompleted
    ) ?? null

  return {
    prescriptions: data?.prescriptions ?? null,
    activePrescriptions,
    prevPrescriptions,
    isLoading: !error && !data,
    isError: error
  }
}

export function usePrescription(id: number): UsePrescription {
  const { data, error } = useSWR<{
    message: string
    prescription: Prescription
  }>(`/api/prescriptions/${id}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  return {
    prescription: data?.prescription ?? null,
    isLoading: !error && !data,
    isError: error
  }
}
