// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { Role, User } from '../../../types/types'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { lockerId, locker_count } = req.body

      const lockerBoxes = Array.from({ length: locker_count }, (_, i) => {
        return { lockerId: lockerId, label: i + 1, status: 'empty' }
      })
      const lockers = await prisma.lockerBox.createMany({ data: lockerBoxes })

      res.status(200).json({ message: ' Success', lockers })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
