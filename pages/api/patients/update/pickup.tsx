import { Patient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let patient: Patient | null = null
    try {
      const request = JSON.parse(req.body)

      const { pickupEnabled: P, id: I } = request.data

      const id: number = parseInt(I)
      const pickupEnabled: boolean = P
      patient = await prisma.patient.update({
        where: {
          id
        },
        data: {
          pickupEnabled: pickupEnabled
        }
      })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
    res.status(200).json({ message: 'Success', patient })
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
