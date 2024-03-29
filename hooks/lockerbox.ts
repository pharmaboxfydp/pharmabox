import { LockerBox } from '@prisma/client'
import useSWR from 'swr'
import { LockerBoxState, User } from '../types/types'

export interface UseLockerboxes {
  lockerboxes: LockerBox[] | null
  emptyLockerboxes: LockerBox[] | null
  isLoading: boolean
  isError: boolean
}

export interface UseLockerbox {
  lockerbox: LockerBox | null
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
}

const fetcher = <T>(...arg: [string, Record<string, any>]): Promise<T> =>
  fetch(...arg).then((res) => res.json())

export function useLockerboxes(user: User): UseLockerboxes {
  const locationId = user.Staff?.locationId || user.Pharmacist?.locationId

  const { data, error } = useSWR<{ message: string; lockerboxes: LockerBox[] }>(
    `/api/lockerboxes/${locationId}`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false
    }
  )

  const lockerboxes =
    data?.lockerboxes?.sort((a, b) => a.label - b.label) ?? null

  const emptyLockerboxes =
    lockerboxes?.filter((box) => box.status === LockerBoxState.empty) ?? null

  return {
    lockerboxes,
    isLoading: !error && !data,
    emptyLockerboxes,
    isError: error
  }
}

export function useLockerbox(user: User, label: number): UseLockerbox {
  const locationId = user.Staff?.locationId || user.Pharmacist?.locationId
  const { data, error } = useSWR<{ message: string; lockerbox: LockerBox }>(
    `/api/lockerboxes/${locationId}/${label}`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false
    }
  )

  return {
    lockerbox: data?.lockerbox ?? null,
    isLoading: !error && !data,
    isEmpty: data?.lockerbox?.status === LockerBoxState.empty,
    isError: error
  }
}
