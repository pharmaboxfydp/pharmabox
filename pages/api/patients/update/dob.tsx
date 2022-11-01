import { Patient, Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let patient: Patient | null = null
    try {
      const request = JSON.parse(req.body) as { data: Patient }
      const { dob: D, userId: I } = request.data
      const userId: string = I
      const dob: string | null = D
      patient = await prisma.patient.update({
        where: {
          userId
        },
        data: {
          dob: dob
        }
      })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
    res.status(200).json({ message: 'Success', body: { patient } })
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
