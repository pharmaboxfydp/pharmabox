export type Role = 'staff' | 'patient'

export type ProtectedRoute = { protected: boolean; allowedRoles: Role[] }
