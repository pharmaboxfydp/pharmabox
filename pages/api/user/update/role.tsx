import { Patient, Pharmacist, Prisma, Staff } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { Role } from '../../../../types/types'

const VALID_EXCEPTION = 'P2025'

/**
 * Deletes a Patient from the Patient Table
 * @param id
 * @returns
 */
async function deletePatient(
  id: string
): Promise<Prisma.Prisma__PatientClient<Patient, never> | null> {
  let deletedRole = null
  try {
    deletedRole = await prisma.patient.delete({
      where: {
        userId: id
      }
    })
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === VALID_EXCEPTION
    ) {
      deletedRole = null
    }
  }
  return deletedRole
}
/**
 * Deletes a Pharmacist from the Pharmacist Table
 * @param id
 * @returns
 */
async function deletePharamcist(
  id: string
): Promise<Prisma.Prisma__PharmacistClient<Pharmacist, never> | null> {
  let deletedRole = null
  try {
    deletedRole = await prisma.pharmacist.delete({
      where: {
        userId: id
      }
    })
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === VALID_EXCEPTION
    ) {
      deletedRole = null
    }
  }
  return deletedRole
}
/**
 * deletes a staff member from the Staff Table
 * @param id
 * @returns
 */
async function deleteStaff(
  id: string
): Promise<Prisma.Prisma__StaffClient<Staff, never> | null> {
  let deletedRole = null
  try {
    deletedRole = await prisma.staff.delete({
      where: {
        userId: id
      }
    })
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === VALID_EXCEPTION
    ) {
      deletedRole = null
    }
  }
  return deletedRole
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      /**
       * if the body data is a string, then do
       * a quick and dirty parse before we destruct it
       */
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const { role: R, id: I, isAdmin: A, locationId: L } = req.body.data
      /**
       * case these types here
       */
      const role = R as Role
      const id = I as string
      const isAdmin = A as boolean
      const locationId = L as string

      const isValidRole: boolean =
        role === Role.Patient || role === Role.Staff || role == Role.Pharmacist

      if (isValidRole) {
        let user
        let deletedRole
        /**
         * If we are making them a staff member
         */
        if (role === Role.Staff) {
          deletedRole = await deletePatient(id)
          deletedRole = await deletePharamcist(id)
          /**
           * Upsert User in Staff table if it does not already exist
           */
          user = await prisma.user.update({
            where: { id: id },
            data: {
              role,
              Staff: {
                connectOrCreate: {
                  where: {
                    userId: id
                  },
                  create: {
                    isAdmin,
                    locationId: parseInt(locationId)
                  }
                }
              }
            }
          })
        }
        /**
         * If we are making them a Patient
         */
        if (role === Role.Patient) {
          deletedRole = await deleteStaff(id)
          deletedRole = await deletePharamcist(id)
          /**
           * Upsert User in staff table if it does not already exist
           */
          user = await prisma.user.update({
            where: { id: id },
            data: {
              role,
              Patient: {
                connectOrCreate: {
                  where: {
                    userId: id
                  },
                  create: {
                    pickupEnabled: true,
                    dob: null
                  }
                }
              }
            }
          })
        }
        if (role == Role.Pharmacist) {
          deletedRole = await deletePatient(id)
          deletedRole = await deleteStaff(id)
          /**
           * Upsert User in Pharmacist table if it does not already exist
           */
          user = await prisma.user.update({
            where: { id: id },
            data: {
              role,
              Pharmacist: {
                connectOrCreate: {
                  where: {
                    userId: id
                  },
                  create: {
                    isAdmin,
                    locationId: parseInt(locationId),
                    /** Pharmacists should not be automatically on duty.
                     *  This is enforced here in addition to the schema
                     */
                    isOnDuty: false
                  }
                }
              }
            }
          })
        }

        res.status(200).json({ message: 'Success', user, deletedRole })
      } else {
        res.status(400).json({ message: 'Role Assignment Not Allowed' })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
