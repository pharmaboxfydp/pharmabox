import theme from '../styles/theme'
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Tabs,
  Tab,
  Text,
  Notification,
  Tip,
  Anchor
} from 'grommet'
import { PrescriptionAndLocationAndPatient, User } from '../types/types'
import { usePatientPrescriptions } from '../hooks/prescriptions'
import Skeleton from 'react-loading-skeleton'
import CardNotification from './CardNotification'
import {
  CheckmarkOutline,
  ErrorFilled,
  Help,
  QrCode
} from '@carbon/icons-react'
import { useState } from 'react'
import QRCodeModal from './QrCode'
import Link from 'next/link'

function Loading() {
  return (
    <>
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={5} height={30} style={{ lineHeight: '3' }} />
      </Box>
    </>
  )
}

function Error() {
  return (
    <>
      <CardNotification>
        <ErrorFilled size={32} color={theme.global.colors['status-error']} />
        <Text textAlign="center">
          Oops! It looks like Pharmabox was not able to load your prescriptions.
          Try refreshing your page. If the issue persists, contact support.
        </Text>
      </CardNotification>
    </>
  )
}

function ActivePatientPrescriptionCards({
  prescriptions,
  isError,
  isLoading,
  shouldBeDisabled
}: {
  prescriptions: PrescriptionAndLocationAndPatient[] | null
  isError: boolean
  isLoading: boolean
  shouldBeDisabled: boolean
}) {
  const [qrCode, setQrCode] = useState<string>('')
  const [lockerBox, setLockerBox] = useState<number | null>(null)
  const [showQrCode, setShowQrCode] = useState<boolean>(false)
  function onClose() {
    setShowQrCode(false)
    setQrCode('')
  }

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <>
      {showQrCode && (
        <QRCodeModal qrCode={qrCode} onClose={onClose} lockerBox={lockerBox} />
      )}
      <Box pad="small" gap="medium">
        {prescriptions?.map(
          ({ id, name, Location, LockerBox, balance, pickupCode }) => (
            <Card key={id} pad="medium" gap="small">
              <CardHeader>
                <Text weight="bold">{name}</Text>
              </CardHeader>
              <CardBody>
                <Box gap="small">
                  <Box flex="grow">
                    <Text>{Location.streetAddress}</Text>
                    <Text>{Location.phoneNumber}</Text>
                    <Text>Lockerbox: {LockerBox.label}</Text>
                  </Box>
                  <Box align="start">
                    <Button
                      icon={<QrCode size={20} />}
                      label="Pickup Code"
                      onClick={() => {
                        setQrCode(pickupCode)
                        setShowQrCode(true)
                        setLockerBox(LockerBox.label)
                      }}
                      primary
                      disabled={shouldBeDisabled}
                    />
                  </Box>
                </Box>
              </CardBody>
              <CardFooter>
                <Text>Amount Due: ${balance}</Text>
              </CardFooter>
            </Card>
          )
        )}
      </Box>
    </>
  )
}

function PreviousPatientPrescriptionCards({
  prescriptions,
  isError,
  isLoading
}: {
  prescriptions: PrescriptionAndLocationAndPatient[] | null
  isError: boolean
  isLoading: boolean
}) {
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error />
  }
  return (
    <Box pad="small" gap="medium">
      {prescriptions?.map(({ id, name, Location, LockerBox, balance }) => (
        <Card key={id} pad="medium" gap="medium">
          <CardHeader>
            <Box direction="row" gap="small">
              <Text weight="bold">{name}</Text>
              <CheckmarkOutline
                size={24}
                color={theme.global.colors['status-ok']}
              />
            </Box>
          </CardHeader>
          <CardBody>
            <Box flex="grow">
              <Text>{Location.streetAddress}</Text>
              <Text>{Location.phoneNumber}</Text>
              <Text>Lockerbox: {LockerBox.label}</Text>
            </Box>
          </CardBody>
          <CardFooter>
            <Text>Amount Paid: ${balance}</Text>
          </CardFooter>
        </Card>
      ))}
    </Box>
  )
}

export default function PatientHomePage({ user }: { user: User }) {
  const [dismissWarning, setDismissWarning] = useState<boolean>(false)

  const { activePrescriptions, prevPrescriptions, isError, isLoading } =
    usePatientPrescriptions(user?.Patient?.id)

  const shouldBeDisabled = !user.Patient?.dob
  return (
    <>
      {shouldBeDisabled && !dismissWarning && (
        <Box animation="fadeIn" pad="small">
          <Notification
            status="critical"
            onClose={() => setDismissWarning(true)}
            message={
              <Box pad="xxsmall" gap="xsmall" direction="row">
                <Text size="small">
                  You must{' '}
                  <Link href="/settings" passHref>
                    <Anchor>provide your birthdate</Anchor>
                  </Link>{' '}
                  before you can begin using Pharmabox
                </Text>
                <Tip
                  content={
                    <Text size="small">
                      Pharmabox requires your date of birth to help confirm your
                      identity at the pharmacy
                    </Text>
                  }
                >
                  <Help size={20} />
                </Tip>
              </Box>
            }
          />
        </Box>
      )}
      <Tabs justify="start">
        <Tab title="Ready for Pickup">
          <ActivePatientPrescriptionCards
            prescriptions={activePrescriptions}
            isError={isError}
            isLoading={isLoading}
            shouldBeDisabled={shouldBeDisabled}
          />
        </Tab>
        <Tab title="Previous Pickups">
          <PreviousPatientPrescriptionCards
            prescriptions={prevPrescriptions}
            isError={isError}
            isLoading={isLoading}
          />
        </Tab>
      </Tabs>
    </>
  )
}
