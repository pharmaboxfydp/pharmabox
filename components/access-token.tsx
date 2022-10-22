import { useSession, signIn, signOut } from 'next-auth/react'
import { UserSession } from '../types'
export default function Component() {
  const { data } = useSession()
  const { accessToken } = data as UserSession
  return <div>Access Token: {`${accessToken}`}</div>
}
