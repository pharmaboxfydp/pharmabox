// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { Role, User } from '../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      let { locationId, locker_count } = req.body

      let lockerBoxes = Array.from({ length: locker_count }, (_, i) => {
        let obj = { id: i + 1, status: 'empty' }
        return obj
      })
      const locker = await prisma.locker.create({
        data: {
          Location: {
            connect: {
              id: locationId
            }
          },
          lockerBoxes: {
            createMany: { data: lockerBoxes }
          }
        }
      })

      res.status(200).json({ message: ' Success', locker })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
