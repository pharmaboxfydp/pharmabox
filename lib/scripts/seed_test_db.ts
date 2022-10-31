/**
 * Allow console statements for scripts
 */
/* eslint-disable no-console */
import prisma from '../prisma'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import { Role, User } from '../../types/types'
import { UserJSON } from '@clerk/backend-core'
import data from './test_data'
import { Staff } from '@prisma/client'

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
async function seedUsers(
  users: UserJSON[]
): Promise<{ count: number; patientUsers: User[]; staffUsers: User[] }> {
  /**
   * remove patients from patients table
   */
  try {
    await prisma.patient.deleteMany({})
  } catch (error) {
    console.error(error)
  }
  /**
   * remove staff from staff tablet
   */
  try {
    await prisma.staff.deleteMany({})
  } catch (error) {
    console.error(error)
  }
  /**
   * remove users from the users table
   */
  try {
    await prisma.user.deleteMany({})
  } catch (error) {
    console.error(error)
  }
  const staffUsers: User[] = []
  const patientUsers: User[] = []

  users.forEach(async (user, index) => {
    const numUses = users.length
    const userNumber = index + 1
    const midpoint = Math.max(numUses / 2)
    let createdAt = new Date(user.created_at)
    let updatedAt = new Date(user.updated_at)

    const newUser: User = {
      id: user.id,
      firstName: user.first_name || `Test-${index}`,
      lastName: user.last_name || `User-${index}`,
      /** pick the first email by default if one exists */
      email: user.email_addresses[0].email_address,
      /** pick first phone number by default if one exists */
      phoneNumber: user.phone_numbers.length
        ? user.phone_numbers[0].phone_number
        : undefined,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      // make half the users patients, and the other half staff locally
      role: userNumber < midpoint ? Role.Patient : Role.Staff
    }

    if (newUser.role === Role.Patient) {
      patientUsers.push(newUser)
    }
    if (newUser.role === Role.Staff) {
      staffUsers.push(newUser)
    }
  })

  const count = staffUsers.length + patientUsers.length

  staffUsers.forEach(async (staffUser: User, index: number) => {
    await prisma.user.create({
      data: {
        ...staffUser,

        Staff: {
          connectOrCreate: {
            where: {
              userId: staffUser.id
            },
            create: {}
          }
        }
      }
    })
  })

  patientUsers.forEach(async (patientUser) => {
    await prisma.user.create({
      data: {
        ...patientUser,
        Patient: {
          connectOrCreate: {
            where: {
              userId: patientUser.id
            },
            create: {
              pickupEnabled: true,
              dob: null
            }
          }
        }
      }
    })
  })

  return { count, patientUsers, staffUsers }
}

async function seedLocations(staff: User[]) {
  const { locations } = data
  await prisma.location.deleteMany({})
  const locs = await prisma.location.createMany({ data: locations })
  const loc1 = await prisma.location.findMany({})

  staff.forEach(async (staffMember, index) => {
    await prisma.staff.update({
      where: { userId: staffMember.id },
      data: {
        Location: {
          connect: {
            id: loc1[index > Math.floor(staff.length) / 2 ? 1 : 0]?.id
          }
        }
      }
    })
  })

  return { locs }
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
        console.info('\x1b[36m%s\x1b[0m', 'PATIENTS -----')
        console.table(payload.patientUsers, [
          'id',
          'firstName',
          'email',
          'role'
        ])
        console.info('\x1b[36m%s\x1b[0m', 'STAFF -----')
        console.table(payload.staffUsers, ['id', 'firstName', 'email', 'role'])
        seedLocations(payload.staffUsers).then((res) => console.log(res))
      })
      .catch((error) => {
        throw new Error(error)
      })
  })
  .catch((error) => {
    throw new Error(error)
  })
