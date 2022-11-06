import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      if (typeof id !== 'string') {
        throw new Error('Invalid Request. Expected stringId')
      }

      const location = await prisma.location.findUniqueOrThrow({
        where: {
          id: parseInt(id)
        }
      })
      res.status(200).json({ message: 'Succcess', location })
    } catch (error) {
      res.status(400).json({ message: 'Bad Request', error })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
