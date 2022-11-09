import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import * as crypto from 'crypto'
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
      const {
        name: N,
        status: S,
        patientId: P,
        balance: B,
        locationId: L,
        lockerBoxId: LB
      } = req.body

      const name: string = N
      const status: Status.AwaitingPickup = S
      const patientId: number = parseInt(P)
      const balance: number = parseFloat(B)
      const locationId: number = parseInt(L)
      const lockerBoxId: number = parseInt(LB)
      const random_key = crypto.randomBytes(20).toString('hex')
      const prescription = await prisma.prescription.create({
        data: {
          name: name,
          status: status,
          balance: balance,
          pickupCode: random_key,
          patientId: patientId,
          lockerBoxId: lockerBoxId,
          locationId: locationId
        }
      })

      const lockerBox = await prisma.lockerBox.update({
        where: { id: lockerBoxId },
        data: {
          status: LockerBoxState.full
        }
      })

      res.status(200).json({ message: 'Success', prescription, lockerBox })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
