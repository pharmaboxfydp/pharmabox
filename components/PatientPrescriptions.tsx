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
  Text
} from 'grommet'
import { PrescriptionAndLocation, User } from '../types/types'
import { usePatientPrescriptions } from '../hooks/prescriptions'
import Skeleton from 'react-loading-skeleton'
import CardNotification from './CardNotification'
import { CheckmarkOutline, ErrorFilled, QrCode } from '@carbon/icons-react'
import { useState } from 'react'
import QRCodeModal from './QrCode'

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
          Oops! It looks like Pharmabox was not able to your prescriptions. Try
          refreshing your page. If the issue persists, contact support.
        </Text>
      </CardNotification>
    </>
  )
}

function ActivePatientPrescriptionCards({
  prescriptions,
  isError,
  isLoading
}: {
  prescriptions: PrescriptionAndLocation[] | null
  isError: boolean
  isLoading: boolean
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
  prescriptions: PrescriptionAndLocation[] | null
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

export default function PatientPrescriptions({ user }: { user: User }) {
  const { activePrescriptions, prevPrescriptions, isError, isLoading } =
    usePatientPrescriptions(user?.Patient?.id)
  return (
    <Tabs justify="start">
      <Tab title="Ready for Pickup">
        <ActivePatientPrescriptionCards
          prescriptions={activePrescriptions}
          isError={isError}
          isLoading={isLoading}
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
  )
}
