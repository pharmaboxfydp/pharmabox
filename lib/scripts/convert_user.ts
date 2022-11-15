/**
 * Allow console statements for scripts
 */
/* eslint-disable no-console */
import fetch from 'node-fetch'
import { Role } from '../../types/types'

type Env = 'prod' | 'dev'

const role: Role = process.argv[2] as Role
const userId: string = process.argv[3] as string
const admin: string = process.argv[4]
const locationId: string = process.argv[5]
const environment: Env = process.argv[6] as Env

const BASE_URL =
  environment === 'dev'
    ? 'http://localhost:3000/api'
    : 'https://pharmabox.vercel.app/api'

async function updateUser({ id, role }: { id: string; role: Role }) {
  const response = await fetch(`${BASE_URL}/user/update/role`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        id,
        role,
        isAdmin: admin === 'admin' ? true : false,
        locationId
      }
    })
  })
  const users = await response.json()
  return users
}

updateUser({ id: userId, role })
  .then((response) => {
    console.log('\x1b[36m%s\x1b[0m', 'CONVERTED USER ----')
    console.table(response, ['role', 'id', 'email'])
  })
  .catch((error) => {
    console.error('Conversion Failed')
    console.error(error)
  })
