// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      let locationId = null
      if (id?.length === 1) {
        locationId = parseInt(id[0])
      } else if (id?.length && id?.length > 1) {
        throw new Error('Invalid Request. Expected 1 Id')
      }

      let location = null

      if (locationId) {
        location = await prisma.location.findUniqueOrThrow({
          where: {
            id: locationId
          },
          include: {
            Prescriptions: true,
            LockerBoxes: true
          }
        })
      } else {
        location = await prisma.location.findMany()
      }
      res.status(200).json({ message: 'Success', location })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e?.toString() })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
