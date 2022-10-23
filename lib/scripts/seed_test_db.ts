/**
 * Aloow console statements for scripts
 */
/* eslint-disable no-console */
import prisma from '../prisma'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import { Role, User } from '../../types/types'
import { UserJSON } from '@clerk/backend-core'
import { Prisma } from '@prisma/client'

dotenv.config()

const BASE_URL = `https://api.clerk.dev/v1`

/**
 * Get users from our dev database
 * @returns User[]
 */
async function getDevUsers(): Promise<UserJSON[]> {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${process.env.CLERK_API_KEY}`
    }
  })
  const users = (await response.json()) as UserJSON[]
  return users
}

/**
 * Seeds users in local database
 * @param users
 * @returns Promise<Prisma.BatchPayload>
 */
async function seedUsers(users: UserJSON[]): Promise<Prisma.BatchPayload> {
  /**
   * remove users from the users table
   */
  try {
    await prisma.user.deleteMany()
  } catch (error) {
    throw new Error(`${error}`)
  }

  const newUsers: User[] = []

  users.forEach(async (user, index) => {
    const numUses = users.length
    const userNumber = index + 1
    const midpoint = Math.max(numUses / 2)

    const newUser: User = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      /** pick the first email by default if one exists */
      email: user.email_addresses[0].email_address,
      /** pick first phone number by default if one exists */
      phone: user.phone_numbers.length
        ? user.phone_numbers[0].phone_number
        : undefined,
      banned: user.banned,
      createdAt: user.created_at.toString(),
      updatedAt: user.updated_at.toString(),
      pickup_enabled: false,
      role: userNumber < midpoint ? Role.Patient : Role.Staff,
      dob: undefined
    }

    newUsers.push(newUser)
  })

  const createdUsers = await prisma.user.createMany({ data: newUsers })
  return createdUsers
}

/**
 * This script is responsible for removing and adding test users
 * to a local database and creating them in Clerk
 */

getDevUsers()
  .then((users) => {
    seedUsers(users)
      .then((payload) => {
        console.info(`Created ${payload.count} Local Users`)
      })
      .catch((error) => {
        throw new Error(error)
      })
  })
  .catch((error) => {
    throw new Error(error)
  })
