import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { page, take } = req.query

      if (
        (page || take) &&
        (typeof page !== 'string' || typeof take !== 'string')
      ) {
        throw new Error('Expected page and take of type string')
      }
      const patients = await prisma.patient.findMany({
        ...(page && take && { skip: parseInt(page), take: parseInt(take) }),
        include: {
          User: true
        }
      })
      res.status(200).json({ message: 'Success', patients })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
