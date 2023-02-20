/**
 * Allow console statements for scripts
 */
/* eslint-disable no-console */
import prisma from '../prisma'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import { LockerBoxState, Role, User } from '../../types/types'
import { UserJSON } from '@clerk/backend-core'
import data from './test_data'
import { LockerBox } from '@prisma/client'
import { faker } from '@faker-js/faker'

dotenv.config()

const BASE_URL = `https://api.clerk.dev/v1`

/**
 * Seed faker.js for repeatable outputs
 */
faker.seed(42)

/**
 * Get users from our dev database
 * @returns User[]
 */
async function getDevUsers(): Promise<UserJSON[]> {
  const response = await fetch(`${BASE_URL}/users?limit=100`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${process.env.CLERK_API_KEY}`
    }
  })
  const users = (await response.json()) as UserJSON[]
  return users
}

async function seedPharmacistsAndStaffUsersFromClerk(users: UserJSON[]) {
  const staffUsers: User[] = []
  const pharmacistUsers: User[] = []
  users.sort()
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
      lastLoggedIn: updatedAt.toISOString(),
      // make half the users pharmacists, and the other half staff locally
      role: userNumber < midpoint ? Role.Pharmacist : Role.Staff
    }

    if (newUser.role === Role.Pharmacist) {
      pharmacistUsers.push(newUser)
    }
    if (newUser.role === Role.Staff) {
      staffUsers.push(newUser)
    }
  })

  const count = staffUsers.length + pharmacistUsers.length
  try {
    Promise.all(
      staffUsers.map(async (staffUser: User, index) => {
        const numUses = staffUsers.length
        const userNumber = index + 1
        const midpoint = Math.max(numUses / 2)
        await prisma.user.create({
          /**
           * Ignore error here since we are going to get an expected mismatch
           */
          // @ts-ignore
          data: {
            ...staffUser,
            Staff: {
              connectOrCreate: {
                where: {
                  userId: staffUser.id
                },
                create: {
                  isAdmin: userNumber < midpoint ?? false
                }
              }
            }
          }
        })
      })
    )
  } catch (error: unknown) {
    throw new Error(error as string)
  }
  try {
    Promise.all(
      pharmacistUsers.map(async (PharmacistUser, index) => {
        const numUses = pharmacistUsers.length
        const userNumber = index + 1
        const midpoint = Math.max(numUses / 2)
        await prisma.user.create({
          /**
           * Ignore error here since we are going to get an expected mismatch
           */
          // @ts-ignore
          data: {
            ...PharmacistUser,
            Pharmacist: {
              connectOrCreate: {
                where: {
                  userId: PharmacistUser.id
                },
                create: {
                  isAdmin: userNumber < midpoint ?? false
                }
              }
            }
          }
        })
      })
    )
  } catch (error: unknown) {
    throw new Error(error as string)
  }

  return { count, pharmacistUsers, staffUsers }
}

async function seedPatients() {
  const numPatientsToCreate = 200
  const patients: User[] = []
  console.info(
    '\x1b[36m%s\x1b[0m',
    `CREATING ${numPatientsToCreate} RANDOM PATIENTS....`
  )

  const numCharacters = 24

  /**
   * Create random users (not connected to clerk so that cannot sign in
   */
  var idx = 0
  while (idx < numPatientsToCreate) {
    const id = `patient_user_${faker.datatype.uuid()}`
    const newUser: User = {
      id,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
      phoneNumber: faker.phone.number(),
      role: Role.Patient,
      lastLoggedIn: faker.date.past().toISOString()
    }
    patients.push(newUser)
    idx++
  }
  try {
    Promise.all(
      patients.map(async (patientUser: User) => {
        await prisma.user.create({
          /**
           * Ignore error here since we are going to get an expected mismatch
           */
          // @ts-ignore
          data: {
            ...patientUser,
            Patient: {
              connectOrCreate: {
                where: {
                  userId: patientUser.id
                },
                create: {
                  pickupEnabled: faker.helpers.arrayElement([true, false]),
                  dob: faker.date.birthdate().toISOString()
                }
              }
            }
          }
        })
      })
    )
  } catch (error: unknown) {
    throw new Error(error as string)
  }
  return { count: numPatientsToCreate, patientUsers: patients }
}

/**
 * Seeds users in local database
 * @param users
 * @returns Promise<Prisma.BatchPayload>
 */
async function seedUsers(users: UserJSON[]): Promise<{
  count: number
  pharmacistUsers: User[]
  staffUsers: User[]
  patientUsers: User[]
}> {
  const {
    count: staffAndPharmacistCount,
    pharmacistUsers,
    staffUsers
  } = await seedPharmacistsAndStaffUsersFromClerk(users)
  const { count: patientCount, patientUsers } = await seedPatients()
  const count = patientCount + staffAndPharmacistCount
  return { count, pharmacistUsers, staffUsers, patientUsers }
}

async function seedLocations(staff: User[], pharmacist: User[]) {
  const { locations } = data

  const [, , seededLocations] = await prisma.$transaction([
    prisma.location.deleteMany({}),
    prisma.location.createMany({ data: locations }),
    prisma.location.findMany({})
  ])

  await Promise.all(
    staff.map(async (staffMember, index) => {
      await prisma.staff.update({
        where: { userId: staffMember.id },
        data: {
          Location: {
            connect: {
              id: seededLocations[index > Math.floor(staff.length) / 2 ? 1 : 0]
                ?.id
            }
          }
        }
      })
    })
  )

  await Promise.all(
    pharmacist.map(async (pharmacistMember, index) => {
      await prisma.pharmacist.update({
        where: { userId: pharmacistMember.id },
        data: {
          Location: {
            connect: {
              id: seededLocations[index > Math.floor(staff.length) / 2 ? 1 : 0]
                ?.id
            }
          }
        }
      })
    })
  )

  return { seededLocations }
}

async function seedLockerBoxes() {
  await prisma.lockerBox.deleteMany({})
  prisma.location.findMany({}).then((locations) => {
    const locationIds = locations.map((location) => location.id)
    locationIds.forEach(async (locationId: number) => {
      const lockerCount = 8
      const lockerBoxes = Array.from(
        { length: lockerCount },
        (_, index: number): Partial<LockerBox> => {
          return {
            label: index + 1,
            status: LockerBoxState.empty,
            locationId
          }
        }
      )
      await Promise.all(
        lockerBoxes.map(async (box: Partial<LockerBox>) => {
          await prisma.lockerBox.create({
            data: {
              label: box.label as number,
              status: box.status as string,
              Location: {
                connect: { id: box.locationId }
              }
            }
          })
        })
      )
    })
  })
}

/**
 * This script is responsible for removing and adding test users
 * to a local database and creating them in Clerk
 */
getDevUsers()
  .then((users) => {
    seedUsers(users)
      .then(async (payload) => {
        const { count, staffUsers, pharmacistUsers, patientUsers } = payload
        /**
         * Log Information about the users created
         */
        console.info(`Created ${count} Local Users`)
        console.info('\x1b[36m%s\x1b[0m', 'STAFF ✅ -----')
        console.table(staffUsers, ['id', 'firstName', 'email', 'role'])
        console.info('\x1b[36m%s\x1b[0m', 'PHARMACISTS ✅ -----')
        console.table(pharmacistUsers, ['id', 'firstName', 'email', 'role'])
        console.info('\x1b[36m%s\x1b[0m', 'PATIENTS (NOT IN CLERK) ✅ -----')
        console.table(patientUsers, ['id', 'firstName', 'email', 'role'])
        /**
         * Create Locations and create teams of users
         */
        seedLocations(staffUsers, pharmacistUsers).then((payload) => {
          const { seededLocations } = payload
          console.info('\x1b[36m%s\x1b[0m', 'LOCATIONS ✅ -----')
          console.table(seededLocations, ['id'])
          seedLockerBoxes().then(() => {
            console.info('\x1b[36m%s\x1b[0m', 'CREATED LOCKER BOXES ✅')
          })
        })
      })
      .catch((error: string) => {
        throw new Error(error)
      })
  })
  .catch((error: string) => {
    throw new Error(error)
  })
