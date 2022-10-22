import { Session, TokenSet, User } from 'next-auth'

export interface GoogleUser extends User {
  emailVerified: null | boolean
  id: string
}

export interface UserSession extends Session {
  accessToken: TokenSet
  id: string | null
  user: GoogleUser
}
