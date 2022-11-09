import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import * as crypto from 'crypto'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {
        name,
        status,
        pickupTime,
        patientId,
        balance,
        locationId,
        lockerBoxId
      } = req.body

      let random_key = crypto.randomBytes(20).toString('hex')
      let prescription = await prisma.prescription.create({
        data: {
          name: name,
          status: status,
          pickupTime: pickupTime,
          balance: balance,
          pickupCode: random_key,
          Patient: {
            connect: {
              id: patientId
            }
          },
          LockerBox: {
            connect: {
              id: lockerBoxId
            }
          },
          Location: {
            connect: {
              id: locationId
            }
          }
        }
      })

      res.status(200).json({ message: 'Success', prescription })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
