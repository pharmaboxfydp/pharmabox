import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query

      if (typeof id !== 'string') {
        throw new Error('Expected prescription id of type string')
      }

      const prescription = await prisma.prescription.findUniqueOrThrow({
        where: {
          id: parseInt(id)
        }
      })

      res.status(200).json({ message: 'Success', prescription: prescription })
    } catch (e) {
      res
        .status(400)
        .json({ message: 'Bad Request', prescription: null, error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
