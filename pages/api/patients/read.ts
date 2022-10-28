// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body
      let patient = null

      if (id) {
        patient = await prisma.patient.findUniqueOrThrow({
          where: {
            id: id
          }
        })
      } else {
        patient = await prisma.patient.findMany({
          include: {
            User: true
          }
        })
      }

      res.status(200).json({ message: 'Success', patient })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
