import { User } from '../types/types'
import useSWR, { mutate } from 'swr'
import { Patient, Prescription } from '@prisma/client'
import { toast } from 'react-toastify'
import { stripNonDigets } from '../helpers/validators'

export interface PatientWithPrescriptionAndUser extends Patient {
  Prescriptions: Prescription[]
  User: User
}

export interface UsePatient {
  patient: PatientWithPrescriptionAndUser | null
  error: Error
  isLoading: boolean
  updatePickup: (data: UpdatePickupInterface) => Promise<void>
  deletePatient: () => Promise<boolean>
  updatePatientDetails: (data: UpdatePatient) => Promise<boolean>
}

export interface UpdatePickupInterface {
  pickupEnabled: boolean
}

export type UpdatePatient = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{
  message: string
  patient: PatientWithPrescriptionAndUser
}> => fetch(...arg).then((res) => res.json())

export default function usePatient(patientId: string): UsePatient {
  const url = `/api/patients/${patientId}`

  const { data, error } = useSWR(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false
  })

  async function updatePickup({
    pickupEnabled
  }: UpdatePickupInterface): Promise<void> {
    const response = await fetch('/api/patients/update/pickup', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          id: patientId,
          pickupEnabled
        }
      })
    })
    if (response.status === 200) {
      const status = pickupEnabled ? 'On' : 'Off'
      toast.success(`Patient Pickup Updated: ${status}`)
    } else {
      toast.error('Unable to Update Status')
    }
    mutate(url)
  }

  async function deletePatient(): Promise<boolean> {
    const response = await fetch(`/api/patients/delete?id=${patientId}`, {
      method: 'DELETE'
    })

    if (response.status === 200) {
      toast.success('Sucessfully Removed Patient')
      mutate(url)
      mutate('/api/patients')
      return true
    }
    toast.error('Unable to Delete Patient')
    return false
  }

  async function updatePatientDetails({
    firstName,
    lastName,
    email,
    phoneNumber
  }: UpdatePatient): Promise<boolean> {
    const response = await fetch('/api/patients/update', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          id: patientId,
          firstName,
          lastName,
          email,
          phoneNumber: stripNonDigets(phoneNumber)
        }
      })
    })
    if (response.status === 200) {
      mutate(url)
      toast.success('Updated Patient')
      return true
    }
    toast.error('Unable to Update Patient')
    return false
  }

  return {
    patient: data?.patient ?? null,
    isLoading: !error && !data,
    error,
    updatePickup,
    deletePatient,
    updatePatientDetails
  }
}
