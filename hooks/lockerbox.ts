import { Location, LockerBox } from '@prisma/client'
import useSWR from 'swr'
import { LockerBoxState, Status, User } from '../types/types'

export interface UseLockerboxes {
  lockerboxes: LockerBox[] | null
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
  const { data, error } = useSWR<{ message: string; lockerboxes: LockerBox[] }>(
    `/api/lockerboxes/${user.Staff?.locationId}`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false
    }
  )

  return {
    lockerboxes: data?.lockerboxes?.sort((a, b) => a.label - b.label) ?? null,
    isLoading: !error && !data,
    isError: error
  }
}

export function useLockerbox(user: User, label: number): UseLockerbox {
  const { data, error } = useSWR<{ message: string; lockerbox: LockerBox }>(
    `/api/lockerboxes/${user.Staff?.locationId}/${label}`,
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
