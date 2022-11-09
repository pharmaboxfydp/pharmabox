import { Location, Prescription } from '@prisma/client'
import useSWR from 'swr'
import { PrescriptionAndLocation, Status, User } from '../types/types'

export interface UsePatientPrescriptions {
  prescriptions: PrescriptionAndLocation[] | null
  activePrescriptions: PrescriptionAndLocation[] | null
  prevPrescriptions: PrescriptionAndLocation[] | null
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

export function usePatientPrescriptions(
  patientId: number | undefined
): UsePatientPrescriptions {
  const { data, error } = useSWR<{
    message: string
    prescriptions: PrescriptionAndLocation[]
  }>(`/api/prescriptions/patient/${patientId}`, fetcher, {
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

export function usePrescription(prescriptionId: number): UsePrescription {
  const { data, error } = useSWR<{
    message: string
    prescription: Prescription
  }>(`/api/prescriptions/${prescriptionId}`, fetcher, {
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
