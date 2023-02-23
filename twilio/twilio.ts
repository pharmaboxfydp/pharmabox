const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export async function sendSMS(phoneNumber: string, message: string) {
  client.messages.create({
    body: message,
    from: "+16066579480",
    to: phoneNumber
  });
}