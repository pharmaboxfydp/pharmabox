import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const locations = await prisma.location.findMany({})
      res.status(200).json({ message: 'Succcess', locations })
    } catch (error) {
      res.status(400).json({ message: 'Bad Request', error })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
