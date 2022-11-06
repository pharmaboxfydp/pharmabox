// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // retrieve prescriptions by id, patientId, or don't specify body to retrieve all
  if (req.method === 'POST') {
    try {
      let data = null
      if (typeof req.body === 'string') {
        data = JSON.parse(req.body)
      } else {
        data = req.body
      }
      const { id: I, patientId: P } = data
      const id: number = I as number
      const patientId: number = P as number

      let prescription = null
      if (id) {
        prescription = await prisma.prescription.findUniqueOrThrow({
          where: {
            id: id
          }
        })
      } else {
        prescription = await prisma.prescription.findMany({
          where: {
            patientId: patientId
          },
          include: {
            Location: true,
            LockerBox: true
          }
        })
      }
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
