// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id: I } = req.query

      const id: number = I ? parseInt(I.toString()) : -1

      let prescription = null

      prescription = await prisma.prescription.findMany({
        where: {
          patientId: id
        },
        include: {
          Location: true,
          LockerBox: true
        }
      })

      res.status(200).json({ message: 'Success', prescription: prescription })
    } catch (e) {
      res
        .status(400)
        .json({
          message: 'Bad Request',
          prescription: null,
          error: e?.toString()
        })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
