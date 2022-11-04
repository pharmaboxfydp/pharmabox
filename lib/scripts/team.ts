/**
 * Allow console statements for scripts
 */
/* eslint-disable no-console */
import fetch from 'node-fetch'

type Env = 'prod' | 'dev'
type Operation = 'add' | 'remove'

type AddStaffPayload = { userId: string; locationId: string }
type RemoveStaffPayload = { userId: string }

const operation: Operation = process.argv[2] as Operation
const userId: string = process.argv[3] as string
const locationId: string = process.argv[4] as string
const environment: Env = process.argv[5] as Env

const BASE_URL =
  environment === 'dev'
    ? 'http://localhost:3000/api'
    : 'https://pharmabox.vercel.app/api'

async function addStaffToLocation({ userId, locationId }: AddStaffPayload) {
  const response = await fetch(`${BASE_URL}/team/members/add`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        userId,
        locationId
      }
    })
  })
  const res = await response.json()
  return res
}

async function removeStaffFromLocation({ userId }: RemoveStaffPayload) {
  const response = await fetch(`${BASE_URL}/team/members/remove`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        userId,
        locationId
      }
    })
  })
  const res = await response.json()
  return res
}

if (operation === 'add') {
  addStaffToLocation({ userId, locationId })
    .then((response) => {
      console.log('\x1b[36m%s\x1b[0m', 'ADDED STAFF USER FROM LOCATION ----')
      console.table(response)
    })
    .catch((error) => {
      console.error('Staff Member Addition Failed')
      console.error(error)
    })
}

if (operation === 'remove') {
  removeStaffFromLocation({ userId })
    .then((response) => {
      console.log('\x1b[36m%s\x1b[0m', 'REMOVED STAFF USER FROM LOCATION ----')
      console.table(response)
    })
    .catch((error) => {
      console.error('Staff Member Removal Failed')
      console.error(error)
    })
}
