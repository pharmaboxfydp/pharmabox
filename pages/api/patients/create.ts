import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { Role } from '../../../types/types'
import { v4 as uuid } from 'uuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let isExistingUser = false
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }

      const { firstName, lastName, phone, email } = req.body.data

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: {
                equals: email
              }
            },
            {
              phoneNumber: {
                equals: phone
              }
            }
          ]
        }
      })

      if (existingUser) {
        isExistingUser = true
        throw new Error(
          `User with email: ${email} or ${phone} already exists`,
          { cause: 'PATIENT_EXISTS' }
        )
      }

      const dateTime = new Date().toISOString()
      const id = `patient_user_${uuid()}`
      const user = await prisma.user.create({
        data: {
          id,
          firstName,
          lastName,
          email,
          phoneNumber: phone,
          role: Role.Patient,
          lastLoggedIn: null,
          createdAt: dateTime,
          updatedAt: dateTime,
          Patient: {
            connectOrCreate: {
              where: {
                userId: id
              },
              create: {
                pickupEnabled: true
              }
            }
          }
        }
      })
      res.status(200).json({ message: 'Success', user })
    } catch (e) {
      const er = e as Error
      if (isExistingUser) {
        res.status(400).json({ message: er.message, error: er })
      } else {
        res.status(400).json({ message: 'Bad Request', error: er })
      }
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
