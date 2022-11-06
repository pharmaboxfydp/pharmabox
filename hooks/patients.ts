import { User } from '../types/types'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'
import { Patient } from '@prisma/client'

export interface UsePatients {
  patients: Patient[] | null
  isLoading: boolean
  isError: Error
}

export type UserPagination = Record<string, string | string[] | undefined>

const fetcher = (
  ...arg: [string, Record<string, any>]
): Promise<{ message: string; patients: Patient[] }> =>
  fetch(...arg).then((res) => res.json())

export default function usePatients(pagination?: UserPagination): UsePatients {
  // const { mutate } = useSWRConfig()

  const url = `/api/patients/${
    pagination && pagination?.take && pagination?.page
      ? `?${new URLSearchParams({
          take: pagination.take.toString(),
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
    isLoading: !error && !data,
    isError: error
  }
}
