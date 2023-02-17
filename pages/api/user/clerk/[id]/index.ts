import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()

const BASE_URL = `https://api.clerk.dev/v1`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${process.env.CLERK_API_KEY}`
        }
      })
      const user = await response.json()
      if (response.status === 200) {
        res.status(200).json({
          message: 'Success',
          user
        })
      } else {
        res.status(400).json({
          message: 'Unable to get user',
          error: user
        })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
