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

      const { locationId: LI, userId: UI } = req.body.data
      const userId: string = UI
      const locationId: number = parseInt(LI)
      const staff = await prisma.staff.update({
        where: { userId: userId },
        data: {
          Location: {
            connect: {
              id: locationId
            }
          }
        }
      })
      res.status(200).json({ message: 'Success', staff })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
