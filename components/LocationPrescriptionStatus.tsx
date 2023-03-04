import { Medication, Person, QID } from '@carbon/icons-react'
import { LockerBox, Patient } from '@prisma/client'
import {
  Anchor,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text
} from 'grommet'
import ReactTimeAgo from 'react-time-ago'
import { formatPhoneNumber } from '../helpers/validators'
import { useLocationPrescriptions } from '../hooks/prescriptions'
import theme from '../styles/theme'
import {
  PrescriptionAndLocationAndPatientAndStaffAndPharmacist,
  User
} from '../types/types'
import { Error } from './Error'
import { Loading } from './Loading'

export function LocationPrescriptionStatus({ user }: { user: User }) {
  const { activePrescriptions, isLoading, isError } =
    useLocationPrescriptions(user)
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return (
      <Error message="Oops! It looks like Pharmabox was not able to load prescriptions. Try refreshing your page. If the issue persists, contact support." />
    )
  }
  return (
    <Box gap="small" border pad="medium" round="small" overflow="auto" fill>
      <Text weight="bold">Prescriptions Awaiting Pickup</Text>
      <Box overflow={{ vertical: 'scroll' }} pad="xsmall" gap="medium">
        {activePrescriptions?.map(
          ({
            name,
            createdTime,
            LockerBox: { label },
            Patient,
            Staff: { User: StaffUser },
            Pharmacist: { User: PharmUser }
          }: PrescriptionAndLocationAndPatientAndStaffAndPharmacist) => (
            <Card pad="small" gap="small" key={label} border>
              <CardHeader>
                <Box direction="row" gap="medium">
                  <Medication
                    size={24}
                    color={theme.global.colors['neutral-3']}
                  />
                  <Text size="small" weight="bold">
                    {name}
                  </Text>
                  <Text size="small">Box: {label}</Text>
                </Box>
              </CardHeader>
              <CardBody gap="small">
                <Box direction="row" gap="medium">
                  <Text size="small">
                    Created:{' '}
                    <ReactTimeAgo
                      date={new Date(createdTime as Date)}
                      locale="en-US"
                    />
                  </Text>
                  <Text size="small">
                    Pharm:{' '}
                    {`${PharmUser.firstName?.charAt(0)} ${PharmUser.lastName}`}
                  </Text>
                  {StaffUser && (
                    <Text size="small">
                      Staff:{' '}
                      {`${StaffUser.firstName?.charAt(0)} ${
                        StaffUser.lastName
                      }`}
                    </Text>
                  )}
                </Box>
                <Text size="small" weight="bold">
                  Patient Information
                </Text>
                <Box direction="row" gap="small" flex>
                  <Person size={20} />
                  <Anchor size="small" href={`/patients/${Patient.id}`}>
                    {Patient.id}
                  </Anchor>
                  <Box direction="row" gap="xsmall">
                    <Text size="small">{Patient.User.firstName}</Text>
                    <Text size="small">{Patient.User.lastName}</Text>
                  </Box>
                  <Text size="small">
                    {formatPhoneNumber(`${Patient.User.phoneNumber}`)}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          )
        )}
      </Box>
    </Box>
  )
}
