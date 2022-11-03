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

      const currentTeamMembers = await prisma.user.findMany({
        where: {
          Staff: {
            locationId: locationId
          }
        },
        include: {
          Staff: true
        }
      })
      // if the user is the first member on the team, make them an admin by default
      const isAdmin: boolean = currentTeamMembers.length === 0
      const staff = await prisma.staff.update({
        where: { userId: userId },
        data: {
          isAdmin,
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
