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
      const { role: R, id } = req.body.data
      const role = R as Role
      if (role === Role.Patient || role === Role.Staff) {
        const user = await prisma.user.update({
          where: { id: id },
          data: { role }
        })
        /**
         * Delete Table in Patient if converted to Staff
         */
        let deletedRole
        if (role === Role.Staff) {
          deletedRole = await prisma.patient.delete({
            where: {
              userId: user.id
            }
          })
        }
        /**
         * Delete Table in Patient if converted to Staff
         */
        if (role === Role.Patient) {
          deletedRole = await prisma.staff.delete({
            where: {
              userId: user.id
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
