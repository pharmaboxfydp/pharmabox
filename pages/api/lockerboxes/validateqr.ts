import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { Status, LockerBoxState } from '../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }

      const { qrCode: Q } = req.body
      const qrCode: string = Q
      const prescription = await prisma.prescription.findFirst({
        where: {
          pickupCode: qrCode,
          status: Status.AwaitingPickup
        }
      })

      if (prescription) {
        const updatedPrescription = await prisma.prescription.update({
          data: {
            status: Status.PickupCompleted
          },
          where: {
            id: prescription.id
          }
        })
        const updatedLockerBox = await prisma.lockerBox.update({
          where: {
            id: prescription.lockerBoxId
          },
          data: {
            status: LockerBoxState.empty
          }
        })
        return res
          .status(200)
          .json({ message: 'Success', updatedPrescription, updatedLockerBox })
      } else {
        return res.status(401).json({ message: 'Invalid QR code', qrCode })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
