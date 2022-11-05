import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      if (id?.length !== 1) {
        throw new Error('Invalid Request. Expected 1 Id')
      }
      const locationId: number = parseInt(id[0])

      const teamMembers = await prisma.user.findMany({
        where: {
          Staff: {
            locationId: locationId
          }
        },
        include: {
          Staff: true
        }
      })
      res.status(200).json({ message: 'Succcess', teamMembers })
    } catch (error) {
      res.status(400).json({ message: 'Bad Request', error })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
