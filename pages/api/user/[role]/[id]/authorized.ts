import { Pharmacist, Staff } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/prisma'
import { Role } from '../../../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { role, id } = req.query
      if (typeof id !== 'string') {
        throw new Error('Expected user id of type string')
      }

      if (role !== Role.Pharmacist && role !== Role.Staff) {
        throw new Error(
          `Expected role of type 'pharmacist' or 'staff' but received role of type ${role}`
        )
      }

      let isAuthorized: boolean = false
      let user: Pharmacist | Staff | null = null

      if (role === Role.Pharmacist) {
        const pharmacist = await prisma.pharmacist.findUniqueOrThrow({
          where: { userId: id }
        })
        isAuthorized = pharmacist?.isOnDuty
        user = pharmacist
      }

      if (role == Role.Staff) {
        const staff = await prisma.staff.findUniqueOrThrow({
          where: { userId: id }
        })
        isAuthorized = staff?.isAuthorized
        user = staff
      }

      res.status(200).json({ message: 'Success', isAuthorized, role, user })
    } catch (e) {
      res.status(400).json({
        message: 'Bad Request',
        isAuthorized: false,
        user: null,
        error: e
      })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
