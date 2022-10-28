/**
 * Allow console statements for scripts
 */
/* eslint-disable no-console */
import fetch from 'node-fetch'
import { Role } from '../../types/types'

type Env = 'prod' | 'dev'

const role: Role = process.argv[2] as Role
const userId: string = process.argv[3] as string
const environment: Env = process.argv[4] as Env

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
        role
      }
    })
  })
  const users = await response.json()
  return users
}

updateUser({ id: userId, role })
  .then((response) => {
    console.info(response)
  })
  .catch((error) => {
    console.error('Conversion Failed')
    console.error(error)
  })
