// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { locationId, label, status } = req.body

      const locker = await prisma.lockerBox.update({
        where: { specificLockerBox: { label: label, locationId: locationId } },
        data: {
          status: status
        }
      })

      res.status(200).json({ message: ' Success', locker })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e?.toString() })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
