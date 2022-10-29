import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { Role } from '../../../../types/types'

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
      const { role: R, id: I } = req.body.data
      /**
       * case these types here
       */
      const role = R as Role
      const id = I as string
      if (role === Role.Patient || role === Role.Staff) {
        let user
        let deletedRole
        if (role === Role.Staff) {
          /**
           * Delete Table in Patient if converted to Staff
           */
          try {
            deletedRole = await prisma.patient.delete({
              where: {
                userId: id
              }
            })
          } catch (e) {
            if (
              e instanceof PrismaClientKnownRequestError &&
              e.code === 'P2025'
            ) {
              deletedRole = null
            }
          }
          /**
           * Upsert User in staff table if it does not already exist
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
                  create: {}
                }
              }
            }
          })
        }

        if (role === Role.Patient) {
          /**
           * Delete Table in Patient if converted to Staff
           */
          try {
            deletedRole = await prisma.staff.delete({
              where: {
                userId: id
              }
            })
          } catch (e) {
            if (
              e instanceof PrismaClientKnownRequestError &&
              e.code === 'P2025'
            ) {
              deletedRole = null
            }
          }
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
