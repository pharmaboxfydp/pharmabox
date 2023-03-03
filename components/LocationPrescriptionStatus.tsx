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
import { useLocationPrescriptions } from '../hooks/prescriptions'
import { User } from '../types/types'
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
      <Box overflow={{ vertical: 'scroll' }} pad="small">
        {activePrescriptions?.map(
          ({
            name,
            LockerBox: { label },
            Patient: { id: patientId }
          }: {
            id: number
            name: string
            LockerBox: LockerBox
            Patient: Patient
          }) => (
            <Box key={label + Math.random()} height={{ min: '180px' }}>
              <Card pad="small" gap="small" width="medium">
                <CardHeader>
                  <Box direction="row" gap="medium">
                    <Medication size={24} />
                    <Text size="small" weight="bold">
                      {name}
                    </Text>
                    <Text size="small">Box: {label}</Text>
                  </Box>
                </CardHeader>
                <CardBody gap="small">
                  <Text size="small" weight="bold">
                    Patient Information
                  </Text>
                  <Box direction="row" gap="medium">
                    <Box direction="row" gap="small">
                      <Person size={20} />
                      <Anchor size="small" href={`/patients/${patientId}`}>
                        {patientId}
                      </Anchor>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          )
        )}
      </Box>
    </Box>
  )
}
