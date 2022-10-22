import { DefaultSession, DefaultUser } from 'next-auth'
import { Role } from './types'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User extends DefaultUser {
    emailVerified?: boolean | null
    id?: string
    role: Role
  }

  interface Session extends DefaultSession {
    user: User
  }
}
