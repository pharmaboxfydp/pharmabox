// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { locationId } = req.query
    try {
      if (typeof locationId !== 'string') {
        throw new Error('Expected LocationId of type string')
      }
      const lockerBoxs = await prisma.lockerBox.findMany({
        where: { locationId: parseInt(locationId) }
      })
      if (!lockerBoxs) {
        res.status(404).json({ message: 'Locker not found' })
      } else {
        res.status(200).json({ message: ' Success', lockerBoxs })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}