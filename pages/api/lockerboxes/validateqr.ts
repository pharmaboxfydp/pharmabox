import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import * as argon2 from 'argon2'
import { Status } from '../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { qrCode } = JSON.parse(req.body)
      const unfilledPrescriptions = await prisma.prescription.findMany({
        where: {
          status: Status.Unfilled
        }
      })

      let isValidCode: boolean = false
      let prescriptionId: number | null = null

      unfilledPrescriptions.forEach(async (prescription) => {
        let isVerified = await argon2.verify(qrCode, prescription.pickupCode)
        if (isVerified) {
          isValidCode = true
          prescriptionId = prescription.id
        }
      })

      if (isValidCode && prescriptionId) {
        const prescription = await prisma.prescription.update({
          data: {
            status: Status.Filled
          },
          where: {
            id: prescriptionId
          }
        })
        return res
          .status(200)
          .json({ message: ' Success', qrCode, prescription })
      }

      return res.status(401).json({ message: 'Invalid QR code', qrCode })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
