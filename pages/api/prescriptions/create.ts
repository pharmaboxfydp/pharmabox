// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { id, name, status, pickupTime, patientId, balance, locationId, lockerBoxId  } = req.body.data

      let prescription = await prisma.prescription.create({
        data: {
          id: id,
          name: name,
          status: status,
          pickupTime: pickupTime,
          balance: balance,
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

      res.status(200).json({ message: 'Success', prescription})
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}