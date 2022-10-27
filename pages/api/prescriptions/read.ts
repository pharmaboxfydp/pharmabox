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
      const { id, patientId } = req.body
      let prescription = null

      if (id) {
        prescription = await prisma.prescription.findUniqueOrThrow({
          where: {
            id: id
          }
        })
      }
       else {
        prescription = await prisma.prescription.findMany({
          where: {
              patientId: patientId
          }
        })
      }
      res.status(200).json({ message: 'Success', prescription })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
