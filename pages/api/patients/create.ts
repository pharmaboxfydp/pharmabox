// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      let { user_id, pickup_enabled, dob, prescriptions } = req.body.data

      var patient = null
      if (!prescriptions) {
        patient = await prisma.patient.create({
          data: {
            pickupEnabled: pickup_enabled,
            dob: dob,
            user: {
              connect: {
                id: user_id
              }
            }
          }
        })
      } else {
        patient = await prisma.patient.create({
          data: {
            pickupEnabled: pickup_enabled,
            dob: dob,
            user: {
              connect: {
                id: user_id
              }
            },
            prescriptions: prescriptions
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
