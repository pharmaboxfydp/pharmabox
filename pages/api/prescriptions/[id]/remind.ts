import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { sendSMS } from '../../../../twilio/twilio'

interface IncommingRequest extends NextApiRequest {
  body: {
    data: {
      prescriptionId: number
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

      const { prescriptionId } = req.body.data

      const prescription = await prisma.prescription.findUniqueOrThrow({
        where: {
          id: prescriptionId
        },
        include: {
          Patient: {
            include: {
              User: true
            }
          },
          LockerBox: true,
          Location: true
        }
      })

      let phoneNumber: string = prescription.Patient?.User.phoneNumber as string

      if (phoneNumber?.charAt(0) === '1') {
        phoneNumber = '+' + phoneNumber
      } else {
        phoneNumber = '+1' + phoneNumber
      }

      const message = `🔔 REMINDER: Your prescription: ${prescription.name} is ready for pick-up! Please go to the pharmacy to pick up your prescription. The prescription is located in locker box: ${prescription.LockerBox.label} at ${prescription.Location.streetAddress}, ${prescription.Location.city}. Your pickup code is ${prescription.pickupCode}.`

      if (!process.env.CI) {
        await sendSMS(phoneNumber, message)
      }
      res.status(200).json({ message: 'Success', prescription })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
