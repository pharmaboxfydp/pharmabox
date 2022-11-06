import theme from '../styles/theme'
import { Box, Card, CardHeader, CardBody } from 'grommet'
import { PharmacyLocation } from '../types/types'

const PharmacyLocationView = ({
  pharmacyLocation
}: {
  pharmacyLocation?: PharmacyLocation
}) => {
  return (
    <>
      {pharmacyLocation && (
        <Card
          pad="medium"
          margin="medium"
          gap="medium"
          background={theme.global.colors['light-1']}
        >
          <CardHeader>{pharmacyLocation.id}</CardHeader>
          <CardBody>
            <Box>
              <div>{pharmacyLocation.streetAddress}</div>
              <div>{pharmacyLocation.phoneNumber}</div>
            </Box>
          </CardBody>
        </Card>
      )}
    </>
  )
}

export default PharmacyLocationView
