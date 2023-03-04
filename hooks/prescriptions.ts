import { Prescription } from '@prisma/client'
import { toast } from 'react-toastify'
import useSWR, { useSWRConfig } from 'swr'

import {
  PrescriptionAndLocationAndPatientAndStaffAndPharmacist,
  Status,
  User
} from '../types/types'

export interface UsePatientPrescriptions {
  prescriptions: PrescriptionAndLocationAndPatientAndStaffAndPharmacist[] | null
  activePrescriptions:
    | PrescriptionAndLocationAndPatientAndStaffAndPharmacist[]
    | null
  prevPrescriptions:
    | PrescriptionAndLocationAndPatientAndStaffAndPharmacist[]
    | null
  isLoading: boolean
  isError: boolean
  refresh: any
}

export interface CreatePrescription {
  name: string
  patientId: number | undefined
  lockerBoxId: number
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
}

const fetcher = <T>(...arg: [string, Record<string, any>]): Promise<T> =>
  fetch(...arg).then((res) => res.json())

export function useLocationPrescriptions(user: User): UsePatientPrescriptions {
  const locationId = user.Staff?.locationId || user.Pharmacist?.locationId
  const { data, error } = useSWR<{
    message: string
    prescriptions: PrescriptionAndLocationAndPatientAndStaffAndPharmacist[]
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
    lockerBoxId
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
      toast.success('Prescription Created')
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

  return {
    prescription: data?.prescription ?? null,
    isLoading: !error && !data,
    isError: error,
    createPrescription,
    sendPickupReminder,
    deletePrescription
  }
}
