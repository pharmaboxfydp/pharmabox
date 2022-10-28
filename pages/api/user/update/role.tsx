// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { Role } from '../../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { role: R, id: I } = req.body.data

      const role = R as Role
      const id = I as string

      if (role === Role.Patient || role === Role.Staff) {
        let user
        let deletedRole

        if (role === Role.Staff) {
          /**
           * Delete Table in Patient if converted to Staff
           */
          deletedRole = await prisma.patient.delete({
            where: {
              userId: id
            }
          })
          /**
           * Upsert User in staff table if it does not already exist
           */
          user = await prisma.user.update({
            where: { id: id },
            data: {
              role,
              Staff: {
                upsert: {
                  create: [{ userId: id }],
                  update: [{ userId: id }]
                }
              }
            }
          })
        }

        if (role === Role.Patient) {
          /**
           * Delete Table in Patient if converted to Staff
           */
          deletedRole = await prisma.staff.delete({
            where: {
              userId: id
            }
          })
          /**
           * Upsert User in staff table if it does not already exist
           */
          user = await prisma.user.update({
            where: { id: id },
            data: {
              role,
              Patient: {
                upsert: {
                  create: [{ userId: id, pickupEnabled: true, dob: '' }],
                  update: [{ userId: id, pickupEnabled: true, dob: '' }]
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
