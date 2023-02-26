import {
  CurrencyDollar,
  ErrorFilled,
  Medication,
  Pen,
  Person,
  QID,
  User as UserIcon,
  Box as BoxIcon
} from '@carbon/icons-react'
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
import { useMemo, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import useAuthorization from '../hooks/authorization'
import { useLockerboxes } from '../hooks/lockerbox'
import usePatients from '../hooks/patients'
import {
  useLocationPrescriptions,
  usePrescriptions
} from '../hooks/prescriptions'
import theme from '../styles/theme'
import { LockerBoxState, Role, Status, User } from '../types/types'
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
  const numBoxes = lockerboxes?.length ?? 1
  const numAvailable = lockerboxes?.filter(
    (box) => box.status === LockerBoxState.empty
  ).length
  const numFull =
    lockerboxes?.filter((box) => box.status === LockerBoxState.full).length ?? 0
  return (
    <Box gap="small" round="small" border pad="medium" overflow="auto" fill>
      <Box direction="row" gap="small">
        <Box width="medium">
          <Text weight="bold">
            Locker Status: {numAvailable}/{numBoxes} Free
          </Text>
        </Box>
        <Box
          width="100%"
          background={theme.global.colors['status-ok']}
          round
          style={{ marginTop: '4px' }}
        >
          <Box
            background={theme.global.colors['status-warning']}
            width={`${(numFull / numBoxes) * 100}%`}
            fill="vertical"
            style={{ display: numFull > 0 ? 'flex' : 'none' }}
            round
            border
          >
            <Text></Text>
          </Box>
        </Box>
      </Box>
      <Box overflow={{ vertical: 'scroll' }} pad="small">
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
            <Box
              key={label}
              height={{ min: '96px' }}
              data-cy="locker-box-status"
            >
              <Card pad="small" gap="small">
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
      <Box overflow={{ vertical: 'scroll' }} pad="small">
        {activePrescriptions?.map(
          ({
            id,
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
                    <Text size="small">Date of Birth:{'  '}</Text>
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
    </Box>
  )
}

function mapPatientsToValues(
  patients: User[]
): { search: string; id: string; patient: User }[] {
  return patients.map((u) => ({
    search: `${u.firstName} ${u.lastName}, ${(() => '-')()}`,
    id: u.id,
    patient: u
  }))
}

function PrescriptionCreationBar({
  activePatients,
  lockerboxes,
  locationId,
  user
}: {
  activePatients: User[]
  lockerboxes: LockerBox[] | null
  locationId: number | null | undefined
  user: User
}) {
  const defaultOptions = useMemo(
    () => (activePatients ? mapPatientsToValues(activePatients) : []),
    [activePatients]
  )
  const defaultLockerOptions = useMemo(
    () =>
      lockerboxes
        ? lockerboxes.filter(
            (lockerbox) => lockerbox.status === LockerBoxState.empty
          )
        : [],
    [lockerboxes]
  )
  const [options, setOptions] = useState(defaultOptions)
  const [lockerboxOptions, setLockerboxOptions] = useState(defaultLockerOptions)
  const { createPrescription } = usePrescriptions()
  const { isAuthorized } = useAuthorization(user)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: {
    value: {
      patient: Patient
      name: string
      balance: string
      lockerbox: number
    }
  }) {
    const {
      value: {
        patient: { id },
        name,
        balance: B,
        lockerbox: label
      }
    } = event

    const lockerBoxId = defaultLockerOptions.filter(
      (lockerbox) => lockerbox.label === label
    )[0].id
    const balance = parseFloat(B)

    let staffId = null
    let pharmacistId = null

    if (user.role === Role.Pharmacist) {
      pharmacistId = user.Pharmacist?.id
    } else {
      pharmacistId = user.Staff?.pharmacistId
      staffId = user?.Staff?.id
    }
    if (locationId) {
      const response = await createPrescription({
        name,
        status: Status.AwaitingPickup,
        patientId: id,
        balance,
        lockerBoxId,
        locationId,
        staffId,
        pharmacistId,
        role: user.role
      })
      if (response.message == 'Success') {
        if (formRef.current) {
          formRef.current.reset()
        }
      }
    }
  }

  return (
    <Box
      gap="small"
      border
      pad="medium"
      round="small"
      overflow="auto"
      direction="row"
    >
      <Form id="new-prescription-form" onSubmit={handleSubmit} ref={formRef}>
        <Box
          direction="row"
          fill="horizontal"
          alignContent="between"
          gap="small"
          flex="grow"
        >
          <FormField lable="Patient" htmlFor="patient" name="patient">
            <Select
              disabled={!isAuthorized}
              icon={<UserIcon size={20} />}
              size="xsmall"
              id="patient"
              name="patient"
              placeholder="Choose Patient"
              options={options}
              onSearch={(text) => {
                const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
                const exp = new RegExp(escapedText, 'i')
                setOptions(
                  defaultOptions.filter(({ search }) => exp.test(search))
                )
              }}
              onClose={() => setOptions(defaultOptions)}
              onChange={({ target: { value } }) => {
                options.filter((option) => option.search === value)
              }}
            >
              {(option) => {
                return (
                  <Box pad="small">
                    <Text size="small">{option.search}</Text>
                  </Box>
                )
              }}
            </Select>
          </FormField>
          <FormField lable="Name" htmlFor="name" name="name">
            <TextInput
              disabled={!isAuthorized}
              size="xsmall"
              placeholder="Prescription Name"
              id="name"
              name="name"
              icon={<Pen size={20} />}
              reverse
            />
          </FormField>
          <FormField lable="balance" htmlFor="balance" name="balance">
            <TextInput
              disabled={!isAuthorized}
              size="xsmall"
              placeholder="Balance Due $00.00"
              id="balance"
              name="balance"
              type="number"
              min={0}
              icon={<CurrencyDollar size={20} />}
              reverse
              step={0.01}
            />
          </FormField>
          <FormField lable="Lockerbox" htmlFor="lockerbox" name="lockerbox">
            <Select
              disabled={!isAuthorized}
              icon={<BoxIcon size={20} />}
              size="xsmall"
              id="lockerbox"
              name="lockerbox"
              placeholder="Choose Locker"
              options={lockerboxOptions.map((option) => option.label)}
              onSearch={(text) => {
                const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
                const exp = new RegExp(escapedText, 'i')
                setLockerboxOptions(
                  defaultLockerOptions.filter(({ label }) =>
                    exp.test(label.toString())
                  )
                )
              }}
              onClose={() => setLockerboxOptions(defaultLockerOptions)}
              onChange={({ target: { value } }) => {
                lockerboxOptions.filter((label) => label === value)
              }}
            >
              {(label) => {
                return (
                  <Box pad="small">
                    <Text size="small">{label}</Text>
                  </Box>
                )
              }}
            </Select>
          </FormField>
          <Box>
            <Button
              style={{ borderRadius: '18px' }}
              type="submit"
              size="xsmall"
              label="Create Prescription"
              primary
              disabled={!isAuthorized}
              data-cy="create-prescription-button"
            />
          </Box>
        </Box>
      </Form>
    </Box>
  )
}

export default function StaffAndPharmacistHomePage({ user }: { user: User }) {
  const { activePatients } = usePatients({})
  const { lockerboxes } = useLockerboxes(user)

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
          <PrescriptionCreationBar
            activePatients={activePatients}
            lockerboxes={lockerboxes}
            locationId={user?.Staff?.locationId || user?.Pharmacist?.locationId}
            user={user}
          />
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
