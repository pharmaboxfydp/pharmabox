import { createContext, useContext } from 'react'
import { Role } from '../types/types'

export const UserRole = createContext<null | undefined | Role>(null)

export const useUserRole = () => {
  return useContext(UserRole)
}
