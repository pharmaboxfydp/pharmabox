// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { label, locationId } = req.query
      const lockerbox = await prisma.lockerBox.findUnique({
        where: {
          specificLockerBox: {
            label: parseInt(label as string),
            locationId: parseInt(locationId as string)
          }
        }
      })
      if (!lockerbox) {
        res.status(404).json({ message: 'Locker not found' })
      } else {
        res.status(200).json({ message: 'Success', lockerbox })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
