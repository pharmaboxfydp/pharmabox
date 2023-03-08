import {
  Flag,
  LocationCompany,
  Phone,
  QID,
  WarningAlt
} from '@carbon/icons-react'
import {
  Text,
  Box,
  Card,
  List,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableBody
} from 'grommet'
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

function KeyCodes() {
  return (
    <Box gap="medium">
      <Box pad={{ left: 'small', top: 'medium' }}>
        <Text>Keyboard Shortcuts</Text>
      </Box>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col" border="bottom">
              <Text size="small">Action</Text>
            </TableCell>
            <TableCell scope="col" border="bottom">
              <Text size="small">Key</Text>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Create a New Prescription For Pickup</Text>
            </TableCell>
            <TableCell>
              <kbd>F1</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Add a New Patient</Text>
            </TableCell>
            <TableCell>
              <kbd>F2</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Go to Dashboad Page</Text>
            </TableCell>
            <TableCell>
              <kbd>F3</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Go to Patients Page</Text>
            </TableCell>
            <TableCell>
              <kbd>F4</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Go to Teams Page</Text>
            </TableCell>
            <TableCell>
              <kbd>F5</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Go to Settings Page</Text>
            </TableCell>
            <TableCell>
              <kbd>F6</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Go to Profile Page</Text>
            </TableCell>
            <TableCell>
              <kbd>F8</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">{`Toggle Authorization (Pharmacists Only)`}</Text>
            </TableCell>
            <TableCell>
              <kbd>Shift</kbd> + <kbd>A</kbd>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">
              <Text size="small">Sign Out</Text>
            </TableCell>
            <TableCell>
              <kbd>Shift</kbd> + <kbd>L</kbd>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

export default function StaffAndPharmacistSettings({ user }: { user: User }) {
  return (
    <>
      <Box gap="medium">
        <Box pad={{ left: 'small', top: 'medium' }}>
          <Text>Location Information</Text>
        </Box>
        <Box
          flex="grow"
          direction="row"
          gap="medium"
          animation="fadeIn"
          pad="small"
        >
          <LocationBlock user={user} />
        </Box>
        <KeyCodes />
      </Box>
    </>
  )
}
