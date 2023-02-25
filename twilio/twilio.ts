const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const pharmaBoxPhoneNumber = '+16066579480'

export async function sendSMS(phoneNumber: string, message: string) {
  client.messages.create({
    body: message,
    from: pharmaBoxPhoneNumber,
    to: phoneNumber
  })
}
