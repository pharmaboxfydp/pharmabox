// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { id, name, status, pickupTime, balance, locationId, lockerBoxId } =
        req.body

      let prescription = null
      prescription = await prisma.prescription.update({
        where: {
          id: id
        },
        data: {
          name: name,
          status: status,
          pickupTime: pickupTime,
          balance: balance,
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
      res.status(200).json({ message: 'Success', prescription: prescription })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
