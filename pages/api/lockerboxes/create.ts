// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LockerBox } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { LockerBoxState } from '../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const { lockerCount: C, locationId: I } = req.body.data
      const lockerCount: number = parseInt(C)
      const locationId: number = parseInt(I)

      const lockerBoxes = Array.from({ length: lockerCount }, (_, index) => {
        return {
          label: index + 1,
          status: LockerBoxState.empty,
          locationId
        }
      })
      const lockers: LockerBox[] = []
      lockerBoxes.forEach(async (box) => {
        const locker = await prisma.lockerBox.create({
          data: {
            label: box.label,
            status: box.status,
            Location: {
              connect: { id: box.locationId }
            }
          }
        })
        lockers.push(locker)
      })

      res.status(200).json({ message: ' Success', lockers })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
