import prisma from '../prisma'
import { faker } from '@faker-js/faker'

async function createRandomUser() {
  const first_name = faker.name.firstName()
  const last_name = faker.name.lastName()
  const email = faker.helpers.unique(faker.internet.email, [first_name])
  const updatedAt = faker.date.recent().toISOString()

  return {
    id: faker.datatype.uuid(),
    first_name: first_name,
    last_name: last_name,
    email: email,
    createdAt: updatedAt,
    updatedAt: updatedAt
  }
}

async function generateUserData() {
  await prisma.user.deleteMany()

  for (let index = 0; index < 100; index++) {
    const random_user = await createRandomUser()

    await prisma.user.create({ data: random_user })
  }
}

generateUserData()
