/**
 * Allow console statements for scripts
 */
/* eslint-disable no-console */
import fetch from 'node-fetch'

type Env = 'prod' | 'dev'
type Operation = 'create' | 'delete'

const operation: Operation = process.argv[2] as Operation
const locationId: string = process.argv[3] as string
const country: string = process.argv[4] as string
const phoneNumber: string = process.argv[5] as string
const address: string = process.argv[6] as string
const environment: Env = process.argv[7] as Env
type CreatePayload = { country: string; phoneNumber: string; address: string }

const BASE_URL =
  environment === 'dev'
    ? 'http://localhost:3000/api'
    : 'https://pharmabox.vercel.app/api'

async function createLocation({
  country,
  phoneNumber,
  address
}: CreatePayload) {
  const data = {
    phoneNumber,
    address: { address: address, country: country }
  }
  const response = await fetch(`${BASE_URL}/locations/create/`, {
    method: 'POST',
    body: JSON.stringify({
      data
    })
  })
  const res = await response.json()
  return res
}

async function deleteLocation({ id }: { id: number }) {
  const response = await fetch(`${BASE_URL}/locations/delete/`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        id: id
      }
    })
  })
  const res = await response.json()
  return res
}

if (operation === 'create') {
  createLocation({ country, phoneNumber, address })
    .then((response) => {
      console.log('\x1b[36m%s\x1b[0m', 'Created LOCATION ----')
      console.table(response)
    })
    .catch((error) => {
      console.error('Location Creation Failed')
      console.error(error)
    })
}

if (operation === 'delete') {
  deleteLocation({ id: parseInt(locationId) })
    .then((response) => {
      console.log('\x1b[36m%s\x1b[0m', 'DELETED LOCATION ----')
      console.table(response)
    })
    .catch((error) => {
      console.error('Location Deletion Failed')
      console.error(error)
    })
}
