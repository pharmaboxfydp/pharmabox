import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }

      const { firstName, lastName, phoneNumber, email, id } = req.body.data

      const patientResp = await prisma.patient.findFirstOrThrow({
        where: { id: parseInt(id) },
        select: { userId: true }
      })

      const user = await prisma.user.update({
        where: {
          id: patientResp.userId
        },
        data: {
          firstName,
          lastName,
          phoneNumber,
          email,
          updatedAt: new Date().toISOString()
        },
        include: {
          Patient: {
            include: {
              Prescriptions: true
            }
          }
        }
      })

      res.status(200).json({ message: 'Success', user })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
