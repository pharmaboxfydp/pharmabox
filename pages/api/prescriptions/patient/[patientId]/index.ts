import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { patientId } = req.query

      if (typeof patientId !== 'string') {
        throw new Error('Expected Patient Id of Type String')
      }

      const prescriptions = await prisma.prescription.findMany({
        where: {
          patientId: parseInt(patientId)
        },
        include: {
          Location: true,
          LockerBox: true,
          Patient: true
        }
      })

      res.status(200).json({ message: 'Success', prescriptions })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
