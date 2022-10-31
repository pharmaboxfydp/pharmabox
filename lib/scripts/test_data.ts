import { faker } from '@faker-js/faker'
const data: { locations: { address: string; phoneNumber: string }[] } = {
  locations: []
}

function seedLocations(count: number) {
  for (let i = 0; i < count; i++) {
    const address = {
      buildingNumber: faker.address.buildingNumber(),
      cardinalDirection: faker.address.cardinalDirection(),
      city: faker.address.city(),
      country: faker.address.country(),
      coordinate: faker.address.nearbyGPSCoordinate(),
      region: faker.address.stateAbbr(),
      street: faker.address.street(),
      address: faker.address.streetAddress(true)
    }
    const phoneNumber = faker.phone.number()

    data.locations.push({
      address: JSON.stringify(address),
      phoneNumber: phoneNumber
    })
  }
}

const locationCount = 10
seedLocations(locationCount)

export default data
