import { Session } from 'next-auth'

export interface UserSession extends Session {
  accessToken: unknown
}
