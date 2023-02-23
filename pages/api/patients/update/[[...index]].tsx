import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { user_id, pickup_enabled, dob, prescriptions } = req.body.data

      let patient = null
      if (!prescriptions) {
        patient = await prisma.patient.update({
          where: {
            userId: user_id
          },
          data: {
            pickupEnabled: pickup_enabled
          }
        })
      } else {
        patient = await prisma.patient.update({
          where: {
            userId: user_id
          },
          data: {
            pickupEnabled: pickup_enabled,

            Prescriptions: prescriptions
          }
        })
      }

      res.status(200).json({ message: 'Success', patient: patient })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
