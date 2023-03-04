import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import * as crypto from 'crypto'
import { Status, LockerBoxState, Role } from '../../../types/types'
import { sendSMS } from '../../../twilio/twilio'
import { Pharmacist, Staff } from '@prisma/client'

interface IncommingRequest extends NextApiRequest {
  body: {
    data: {
      name: string
      createdTime: string
      creatorId: string
      creatorRole: Role
      locationId: number
      lockerBoxId: number
      patientId: number
    }
  }
}

export default async function handler(
  req: IncommingRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }

      const {
        name,
        createdTime,
        creatorId,
        creatorRole,
        locationId,
        lockerBoxId,
        patientId
      } = req.body.data

      const randomKey = crypto.randomInt(100000, 999999).toString()

      let creator: Staff | Pharmacist
      const isPharmacist: boolean = creatorRole === Role.Pharmacist
      const isStaff: boolean = creatorRole === Role.Staff

      if (isPharmacist) {
        creator = await prisma.pharmacist.findUniqueOrThrow({
          where: {
            userId: creatorId
          },
          include: {
            User: true
          }
        })
      } else {
        creator = await prisma.staff.findUniqueOrThrow({
          where: {
            userId: creatorId
          },
          include: {
            User: true,
            authorizer: true
          }
        })
      }

      const prescription = await prisma.prescription.create({
        data: {
          name,
          status: Status.AwaitingPickup,
          createdTime,
          balance: 0,
          Patient: {
            connect: {
              id: patientId
            }
          },
          Location: {
            connect: {
              id: locationId
            }
          },
          pickupCode: randomKey,
          LockerBox: {
            connect: {
              id: lockerBoxId
            }
          },
          ...(isStaff && {
            Staff: {
              connect: {
                id: creator?.id
              }
            },
            Pharmacist: {
              connect: {
                id: (creator as Staff).pharmacistId as number
              }
            }
          }),
          ...(isPharmacist && {
            Pharmacist: {
              connect: {
                id: creator.id
              }
            }
          })
        }
      })

      const patient = await prisma.patient.findUniqueOrThrow({
        where: { id: patientId },
        include: {
          User: true
        }
      })

      const location = await prisma.location.findUniqueOrThrow({
        where: { id: locationId }
      })

      if (!patient.User?.phoneNumber) {
        return res.status(400).json({
          message:
            "User does not have a phone number. Please add a phone number to this users's account"
        })
      }

      let phoneNumber: string = patient.User?.phoneNumber

      if (phoneNumber?.charAt(0) === '1') {
        phoneNumber = '+' + phoneNumber
      } else {
        phoneNumber = '+1' + phoneNumber
      }

      const message = `💊 Your prescription: ${prescription.name} is ready for pick-up! Please go to the pharmacy to pick up your prescription. The prescription is located in locker box: ${lockerBoxId} at ${location.streetAddress}, ${location.city}. Your pickup code is ${randomKey}`

      if (!process.env.CI) {
        await sendSMS(phoneNumber, message)
      }

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
