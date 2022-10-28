// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { locationId, label } = req.body
      const lockerBox = await prisma.lockerBox.findUnique({
        where: { specificLockerBox: { label: label, locationId: locationId } }
      })
      if (!lockerBox) {
        res.status(404).json({ message: 'Locker not found' })
      } else {
        res.status(200).json({ message: ' Success', lockerBox })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
