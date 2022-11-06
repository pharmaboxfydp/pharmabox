// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { locationId: I, label: L } = req.query

      const locationId: number = I ? parseInt(I.toString()) : -1
      const label: number = L ? parseInt(L.toString()) : -1

      const lockerBox = await prisma.lockerBox.findUnique({
        where: { specificLockerBox: { label: label, locationId: locationId } }
      })
      if (!lockerBox) {
        res.status(404).json({ message: 'Locker not found' })
      } else {
        res.status(200).json({ message: ' Success', lockerBox })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e?.toString() })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
