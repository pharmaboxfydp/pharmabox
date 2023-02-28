import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import * as crypto from 'crypto'
import { Status, LockerBoxState, Role } from '../../../types/types'
import { sendSMS } from '../../../twilio/twilio'

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
        lockerBoxId: LB,
        staffId: SI,
        pharmacistId: PI,
        role: R
      } = req.body.data
      const name: string = N
      const status: Status.AwaitingPickup = S
      const patientId: number = parseInt(P)
      const balance: number = parseFloat(B)
      const locationId: number = parseInt(L)
      const lockerBoxId: number = parseInt(LB)
      const pharmacistId = parseInt(PI)
      const staffId = SI ? parseInt(SI) : null
      const random_key = crypto.randomInt(100000, 999999).toString()

      const prescription = await prisma.prescription.create({
        data: {
          name: name,
          status: status,
          balance: balance,
          pickupCode: random_key,
          patientId: patientId,
          lockerBoxId: lockerBoxId,
          locationId: locationId,
          pharmacistId,
          staffId
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

      const formatted_message = `There has been an order placed for your prescription: ${prescription.name}. Please go to the pharmacy to pick up your prescription.
      The prescription is located in locker box ${lockerBoxId} at ${location.streetAddress}, ${location.city}, ${location.province}, ${location.country}.

      Your pickup code is ${random_key}`

      if (process.env.CI) {
        await sendSMS(phoneNumber, formatted_message)
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
