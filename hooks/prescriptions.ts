import { Prescription } from '@prisma/client'
import { toast } from 'react-toastify'
import useSWR, { useSWRConfig } from 'swr'

import {
  PrescriptionAndLocationAndPatient,
  Role,
  Status,
  User
} from '../types/types'

export interface UsePatientPrescriptions {
  prescriptions: PrescriptionAndLocationAndPatient[] | null
  activePrescriptions: PrescriptionAndLocationAndPatient[] | null
  prevPrescriptions: PrescriptionAndLocationAndPatient[] | null
  isLoading: boolean
  isError: boolean
  refresh: any
}

export interface UsePrescription {
  prescription: Prescription | Prescription[] | null
  isLoading: boolean
  isError: boolean
  createPrescription: ({
    name,
    status,
    patientId,
    balance,
    locationId,
    lockerBoxId
  }: {
    name: string
    status: Status
    patientId: number
    balance: number
    locationId: number
    lockerBoxId: number
    pharmacistId: number | null | undefined
    staffId: number | null | undefined
    role: Role | undefined
  }) => Promise<any>
}

const fetcher = <T>(...arg: [string, Record<string, any>]): Promise<T> =>
  fetch(...arg).then((res) => res.json())

export function usePatientPrescriptions(
  patientId: number | undefined
): UsePatientPrescriptions {
  const { data, error } = useSWR<{
    message: string
    prescriptions: PrescriptionAndLocationAndPatient[]
  }>(`/api/prescriptions/patient/${patientId}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  const { mutate } = useSWRConfig()
  function refresh() {
    mutate(`/api/prescriptions/patient/${patientId}`)
  }

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
    isError: error,
    refresh
  }
}

export function useLocationPrescriptions(user: User): UsePatientPrescriptions {
  const locationId = user.Staff?.locationId || user.Pharmacist?.locationId
  const { data, error } = useSWR<{
    message: string
    prescriptions: PrescriptionAndLocationAndPatient[]
  }>(`/api/prescriptions/location/${locationId}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })
  const { mutate } = useSWRConfig()
  function refresh() {
    mutate(`/api/prescriptions/location/${user?.Staff?.locationId}`)
  }
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
    isError: error,
    refresh
  }
}

export function usePrescriptions(prescriptionId?: number): UsePrescription {
  const { mutate } = useSWRConfig()

  const { data, error } = useSWR<{
    message: string
    prescription: Prescription[] | Prescription
  }>(`/api/prescriptions/${prescriptionId ?? ''}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  async function createPrescription({
    name = 'Unnamed Prescription',
    status = Status.AwaitingPickup,
    patientId,
    balance = 0,
    locationId,
    lockerBoxId,
    pharmacistId,
    staffId,
    role
  }: {
    name: string
    status: Status
    patientId: number
    balance: number
    locationId: number
    lockerBoxId: number
    pharmacistId: number | null | undefined
    staffId: number | null | undefined
    role: Role | undefined
  }): Promise<{ message: string; prescription: Prescription }> {
    const response = await fetch('/api/prescriptions/create', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          name,
          status,
          patientId,
          balance,
          locationId,
          lockerBoxId,
          pharmacistId,
          staffId,
          role
        }
      })
    })
    if (response.status === 200) {
      mutate(`/api/prescriptions/location/${locationId}`)
      mutate(`/api/prescriptions/patient/${patientId}`)
      mutate(`/api/lockerboxes/${locationId}`)

      toast.success(`Prescription Created for Patient ${patientId}`, {
        icon: '✨'
      })
    } else {
      toast.error('Unable to Create Prescription', { icon: '❌' })
    }
    const res = await response.json()
    return res
  }

  return {
    prescription: data?.prescription ?? null,
    isLoading: !error && !data,
    isError: error,
    createPrescription
  }
}
