import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { id } = req.query
      if (typeof id !== 'string') {
        throw new Error('Expected one id of type string')
      }
      const patient = await prisma.patient.findUniqueOrThrow({
        where: {
          id: parseInt(id)
        },
        include: { User: true, Prescriptions: true }
      })

      res.status(200).json({ message: 'Success', patient })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
