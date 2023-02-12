import { atom } from 'jotai'
import { User } from '../types/types'

const isAuthorizated = atom<boolean>(false)

export default function useAuthorization(user: User) {}
