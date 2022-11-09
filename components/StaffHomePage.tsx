import { ErrorFilled, Medication, Person, QID } from '@carbon/icons-react'
import { LockerBox, Patient } from '@prisma/client'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormField,
  Grid,
  Select,
  Tag,
  Text,
  TextInput
} from 'grommet'
import { capitalize } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useLockerboxes } from '../hooks/lockerbox'
import usePatients, { FullPatient } from '../hooks/patients'
import { useLocationPrescriptions } from '../hooks/prescriptions'
import theme from '../styles/theme'
import { LockerBoxState, User } from '../types/types'
import CardNotification from './CardNotification'

function Loading() {
  return (
    <>
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={8} height={30} style={{ lineHeight: '3' }} />
      </Box>
    </>
  )
}

function Error({ message }: { message: string }) {
  return (
    <>
      <CardNotification>
        <ErrorFilled size={32} color={theme.global.colors['status-error']} />
        <Text textAlign="center">{message}</Text>
      </CardNotification>
    </>
  )
}

function LockerboxesStatus({ user }: { user: User }) {
  const { lockerboxes, isLoading, isError } = useLockerboxes(user)
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return (
      <Error message="Oops! It looks like Pharmabox was not able to load lockerboxes. Try refreshing your page. If the issue persists, contact support." />
    )
  }
  return (
    <Box gap="small" round="small" border pad="medium" overflow="auto" fill>
      <Text weight="bold">Locker Status</Text>
      <Box overflow={{ vertical: 'scroll' }}>
        {lockerboxes?.map(
          ({
            label,
            id,
            status
          }: {
            label: number
            id: number
            status: string
          }) => (
            <Box key={label} height={{ min: '96px' }}>
              <Card width="small" pad="small" gap="small">
                <CardHeader>
                  <Text size="small" weight="bold">
                    Locker Number:{' '}
                    <Text size="small" weight="bold">
                      {label}
                    </Text>
                  </Text>
                </CardHeader>
                <CardBody>
                  <Box direction="row" justify="between">
                    <Box direction="row">
                      <QID size={24} />
                      <Text>{id}</Text>
                    </Box>
                    <Box
                      round
                      background={
                        status === LockerBoxState.empty
                          ? theme.global.colors['status-ok']
                          : theme.global.colors['status-warning']
                      }
                      style={{ color: theme.global.colors.white }}
                    >
                      <Tag
                        size="xsmall"
                        name="Status"
                        value={capitalize(status)}
                      />
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

function LocationPrescriptionStatus({ user }: { user: User }) {
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
      {activePrescriptions?.map(
        ({
          id,
          name,
          LockerBox: { label },
          Patient: { dob, id: patientId }
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
                  <Text size="small">
                    Date of Birth:{'  '}
                    {(() => (dob ? new Date(dob).toDateString() : '-'))()}
                  </Text>
                  <Box direction="row" gap="small">
                    <Person size={20} />
                    <Text size="small">{patientId}</Text>
                  </Box>
                </Box>
              </CardBody>
              <CardFooter>
                <Box direction="row" justify="between">
                  <Box direction="row">
                    <QID size={20} />
                    <Text size="small">{id}</Text>
                  </Box>
                </Box>
              </CardFooter>
            </Card>
          </Box>
        )
      )}
    </Box>
  )
}

function mapPatientsToValues(
  patients: FullPatient[]
): { search: string; id: number; patient: Patient }[] {
  return patients.map((patient) => ({
    search: `${patient.User.firstName} ${patient.User.lastName} ${patient.dob}`,
    id: patient.id,
    patient
  }))
}

function PrescriptionCreationBar({
  activePatients
}: {
  activePatients: FullPatient[]
}) {
  const defaultOptions = useMemo(
    () => (activePatients ? mapPatientsToValues(activePatients) : []),
    [activePatients]
  )
  const [options, setOptions] = useState(defaultOptions)
  const [targetPatient, setTargetPatient] = useState()

  return (
    <Box
      gap="small"
      border
      pad="medium"
      round="small"
      overflow="auto"
      direction="row"
    >
      <Form id="new-prescription-form">
        <Box direction="row" fill="horizontal" justify="between">
          <FormField lable="Patient" htmlFor="patient" name="patient">
            <Select
              size="small"
              id="patient"
              name="patient"
              options={options}
              onSearch={(text) => {
                const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
                const exp = new RegExp(escapedText, 'i')
                setOptions(
                  defaultOptions.filter(({ search }) => exp.test(search))
                )
              }}
              onClose={() => setOptions(defaultOptions)}
              onChange={(event) => {
                debugger
              }}
            >
              {(option) => {
                return (
                  <Text size="small">
                    <option data-value={JSON.stringify(option)}>
                      {option.search}
                    </option>
                  </Text>
                )
              }}
            </Select>
          </FormField>
          <Button type="submit" label="Create Prescription" />
        </Box>
      </Form>
    </Box>
  )
}

export default function StaffHomePage({ user }: { user: User }) {
  const { activePatients } = usePatients()
  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      gap="small"
      areas={[
        { name: 'fulfill', start: [0, 0], end: [1, 1] },
        { name: 'left-pannel', start: [0, 1], end: [0, 1] },
        { name: 'right-pannel', start: [1, 1], end: [1, 1] }
      ]}
    >
      <Box gridArea="fulfill">
        {activePatients && (
          <PrescriptionCreationBar activePatients={activePatients} />
        )}
      </Box>
      <Box gridArea="left-pannel">
        <LocationPrescriptionStatus user={user} />
      </Box>
      <Box gridArea="right-pannel">
        <LockerboxesStatus user={user} />
      </Box>
    </Grid>
  )
}
