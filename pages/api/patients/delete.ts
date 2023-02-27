import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      const patient = await prisma.patient.findFirstOrThrow({
        where: {
          id: parseInt(`${id}`)
        }
      })

      await prisma.user.delete({
        where: {
          id: patient.userId
        }
      })

      res.status(200).json({ message: 'Success', patient: patient })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
