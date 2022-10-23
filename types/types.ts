export type User = {
    id: string,
    first_name?: string,
    last_name?: string,
    email?: string,
    phone?: string,
    banned: boolean,
    pickup_enabled: boolean,
    role?: string,
    dob?: string,
    createdAt: string,
    updatedAt: string
}