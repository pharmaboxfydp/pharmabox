import {
  Flag,
  LocationCompany,
  Phone,
  QID,
  WarningAlt
} from '@carbon/icons-react'
import { Text, Box, Card } from 'grommet'
import Skeleton from 'react-loading-skeleton'
import useLocation from '../hooks/location'
import theme from '../styles/theme'
import { User } from '../types/types'

function LocationBlock({ user }: { user: User }) {
  const { location, isLoading, isError } = useLocation(user)
  if (isLoading && !isError) {
    return (
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={5} height={30} style={{ lineHeight: '3' }} />
      </Box>
    )
  }

  if (location) {
    return (
      <Box gap="small">
        <Box direction="row" gap="small">
          <QID size={20} />
          <Text size="small">{location.id}</Text>
        </Box>
        <Box direction="row" gap="small">
          <LocationCompany size={20} />
          <Text size="small">
            {location.streetAddress} {location.cardinalDirection}
          </Text>
        </Box>
        <Box direction="row" gap="small">
          <Flag size={20} />
          <Text size="small">
            {location.city}, {location.province}. {location.country}
          </Text>
        </Box>
        <Box direction="row" gap="small">
          <Phone size={20} />
          <Text size="small">{location.phoneNumber}</Text>
        </Box>
        <Text size="small" color={theme.global.colors['dark-6']}>
          Contact Pharmabox to update your location information
        </Text>
      </Box>
    )
  }
  return (
    <Box
      pad="medium"
      direction="row"
      flex="grow"
      gap="medium"
      align="center"
      justify="center"
    >
      <Card align="center" gap="medium" pad="large">
        <WarningAlt size={32} color={theme.global.colors['status-warning']} />
        <Text size="large">Unable to retrieve location information</Text>
      </Card>
    </Box>
  )
}

export default function StaffAndPharmacistSettings({ user }: { user: User }) {
  return (
    <>
      <Box gap="medium" pad="small">
        <Text>Location Information</Text>
        <Box flex="grow" direction="row" gap="medium" animation="fadeIn">
          <LocationBlock user={user} />
        </Box>
      </Box>
    </>
  )
}
