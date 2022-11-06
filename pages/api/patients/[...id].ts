import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      if (id?.length !== 1) {
        throw new Error('Invalid Request. Expected 1 Id')
      }

      const patientId: number = parseInt(id[0])

      const patient = await prisma.patient.findUniqueOrThrow({
        where: {
          id: patientId
        }
      })

      res.status(200).json({ message: 'Success', patient })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e?.toString() })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
