import { Prescription } from '@prisma/client'
import { toast } from 'react-toastify'
import useSWR, { useSWRConfig } from 'swr'

import { FullPrescription, Status, User } from '../types/types'

export interface UsePatientPrescriptions {
  prescriptions: FullPrescription[] | null
  activePrescriptions: FullPrescription[] | null
  prevPrescriptions: FullPrescription[] | null
  isLoading: boolean
  isError: boolean
  refresh: any
}

export interface CreatePrescription {
  name: string
  patientId: number | undefined
  lockerBoxId: number
  lockerBoxLabel: number
}

export interface UsePrescription {
  prescription: Prescription | Prescription[] | null
  isLoading: boolean
  isError: boolean
  createPrescription: ({
    name,
    patientId,
    lockerBoxId
  }: CreatePrescription) => Promise<any>
  sendPickupReminder: ({
    prescriptionId
  }: {
    prescriptionId: number
  }) => Promise<boolean>
  deletePrescription: ({
    prescriptionId,
    patientId
  }: {
    prescriptionId: number
    patientId: number
  }) => Promise<boolean>
  markPrescriptionPickedUp: ({
    prescriptionId,
    patientId
  }: {
    prescriptionId: number
    patientId: number
  }) => Promise<boolean>
}

const fetcher = <T>(...arg: [string, Record<string, any>]): Promise<T> =>
  fetch(...arg).then((res) => res.json())

export function useLocationPrescriptions(user: User): UsePatientPrescriptions {
  const locationId = user.Staff?.locationId || user.Pharmacist?.locationId
  const { data, error } = useSWR<{
    message: string
    prescriptions: FullPrescription[]
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

export function usePatientPrescriptions(
  patientId: number | undefined
): UsePatientPrescriptions {
  const { data, error } = useSWR<{
    message: string
    prescriptions: FullPrescription[]
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
    data?.prescriptions?.filter(
      (prescription) => prescription.status === Status.AwaitingPickup
    ) ?? null

  const prevPrescriptions =
    data?.prescriptions?.filter(
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

export function usePrescriptions({
  prescriptionId,
  user
}: {
  prescriptionId?: number
  user: User
}): UsePrescription {
  const { mutate } = useSWRConfig()
  const locationId = user?.Pharmacist?.locationId || user?.Staff?.locationId

  const { data, error } = useSWR<{
    message: string
    prescription: Prescription[] | Prescription
  }>(`/api/prescriptions/${prescriptionId ?? ''}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  async function createPrescription({
    name,
    patientId,
    lockerBoxId,
    lockerBoxLabel
  }: CreatePrescription): Promise<boolean> {
    const creatorRole = user.role
    const createdTime = new Date().toISOString()

    const response = await fetch('/api/prescriptions/create', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          name,
          patientId,
          lockerBoxId,
          creatorRole,
          creatorId: user.id,
          locationId,
          createdTime
        }
      })
    })
    if (response.status === 200) {
      mutate(`/api/prescriptions/location/${locationId}`)
      mutate(`/api/prescriptions/patient/${patientId}`)
      mutate(`/api/lockerboxes/${locationId}`)
      mutate(`/api/lockerboxes/${locationId}`)
      toast.success(
        `Prescription Created. Place Prescription in Locker ${lockerBoxLabel}`
      )
      return true
    }
    toast.error('Unable to Create Prescription')
    return false
  }

  async function sendPickupReminder({
    prescriptionId
  }: {
    prescriptionId: number
  }): Promise<boolean> {
    const response = await fetch(
      `/api/prescriptions/${prescriptionId}/remind`,
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            prescriptionId
          }
        })
      }
    )
    if (response.status === 200) {
      toast.success('Reminder Sent')
      return true
    }
    toast.error('Unable to Send Reminder')
    return false
  }

  async function deletePrescription({
    prescriptionId,
    patientId
  }: {
    prescriptionId: number
    patientId: number
  }): Promise<boolean> {
    const response = await fetch(
      `/api/prescriptions/delete?id=${prescriptionId}`,
      {
        method: 'DELETE'
      }
    )
    if (response.status === 200) {
      mutate(`/api/prescriptions/location/${locationId}`)
      mutate(`/api/prescriptions/patient/${patientId}`)
      mutate(`/api/lockerboxes/${locationId}`)
      toast.success('Prescription Removed')
      return true
    }
    toast.error('Unable to Delete Prescription')
    return false
  }

  async function markPrescriptionPickedUp({
    prescriptionId,
    patientId
  }: {
    prescriptionId: number
    patientId: number
  }) {
    const response = await fetch(
      `/api/prescriptions/${prescriptionId}/picked-up`,
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            prescriptionId
          }
        })
      }
    )
    if (response.status === 200) {
      mutate(`/api/prescriptions/location/${locationId}`)
      mutate(`/api/prescriptions/patient/${patientId}`)
      mutate(`/api/lockerboxes/${locationId}`)
      toast.success('Prescription Marked as Retreived')
      return true
    } else {
      toast.error('Unable to Update Prescription')
      return false
    }
  }

  return {
    prescription: data?.prescription ?? null,
    isLoading: !error && !data,
    isError: error,
    createPrescription,
    sendPickupReminder,
    deletePrescription,
    markPrescriptionPickedUp
  }
}
