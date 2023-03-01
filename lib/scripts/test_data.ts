import { faker } from '@faker-js/faker'

faker.seed(42)

const data: {
  locations: {
    streetAddress: string
    cardinalDirection: string
    city: string
    country: string
    province: string
    phoneNumber: string
  }[]
} = {
  locations: []
}
function seedLocations(count: number) {
  for (let i = 0; i < count; i++) {
    const newLocation = {
      streetAddress: faker.address.streetAddress(),
      cardinalDirection: faker.address.cardinalDirection(),
      city: faker.address.city(),
      country: faker.address.country(),
      province: faker.address.stateAbbr(),
      phoneNumber: faker.phone.number()
    }

    data.locations.push(newLocation)
  }
}

const locationCount = 10
seedLocations(locationCount)

export default data
