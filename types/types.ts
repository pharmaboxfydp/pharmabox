import { BuiltInProviderType } from 'next-auth/providers'
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react'

export type Role = 'staff' | 'patient'

export type PageName = '/' | '/signin'

export type Provider = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null

export type ProtectedRoute = {
  protected: boolean
  allowedRoles: Role[]
  providers?: Provider
  page: PageName
}
