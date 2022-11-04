import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const { email: E, locationId: LI, isAdmin: A } = req.body.data
      const email: string = E
      const locationId: number = parseInt(LI)
      const isAdmin: boolean = A

      const currentUser = await prisma.user.findUnique({
        where: {
          email
        }
      })

      const staffUser = await prisma.user.update({
        where: {
          email
        },
        data: {
          Staff: {
            connectOrCreate: {
              where: {
                userId: currentUser?.id
              },
              create: {
                isAdmin,
                locationId
              }
            }
          }
        },
        include: { Staff: true }
      })

      res.status(200).json({ message: 'Success', staffUser })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
