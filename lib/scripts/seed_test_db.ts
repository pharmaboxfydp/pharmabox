import prisma from '../prisma'
import { faker } from '@faker-js/faker'

async function createRandomUser() {
  const name = faker.name.fullName()
  const email = faker.helpers.unique(faker.internet.email, [name])
  const updatedAt = faker.date.recent()

  return {
    id: faker.datatype.uuid(),
    name: name,
    email: email,
    updatedAt: updatedAt
  }
}

async function generateUserData() {
  await prisma.user.deleteMany()

  for (let index = 0; index < 100; index++) {
    const random_user = await createRandomUser()

    await prisma.user.create({
      data: random_user
    })
  }
}

generateUserData()
