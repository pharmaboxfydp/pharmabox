import theme from '../styles/theme'
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Tabs,
  Tab
} from 'grommet'
import { PrescriptionAndLocation } from '../types/types'

const PatientPrescriptions = ({
  prescriptions,
  previousPrescriptions,
  setQrCode,
  setShowQrCode
}: {
  prescriptions: PrescriptionAndLocation[]
  previousPrescriptions: PrescriptionAndLocation[]
  setQrCode: any
  setShowQrCode: any
}) => {
  return (
    <Tabs justify="start">
      <Tab title="Ready for Pickup">
        {prescriptions.map(
          ({ id, name, Location, LockerBox, balance, pickupCode }) => (
            <Card
              key={id}
              pad="medium"
              margin="medium"
              gap="medium"
              background={theme.global.colors['light-1']}
            >
              <CardHeader>{name}</CardHeader>
              <CardBody>
                <Box>
                  <div>{Location.streetAddress}</div>
                  <div>{Location.phoneNumber}</div>
                  <div>Lockerbox: {LockerBox.label}</div>
                  <Box align="start" pad="none">
                    <Button
                      label="QR Code"
                      onClick={() => {
                        setQrCode(pickupCode)
                        setShowQrCode(true)
                      }}
                      style={{
                        background: theme.global.colors['status-ok'],
                        borderRadius: '4px'
                      }}
                      size="medium"
                    />
                  </Box>
                </Box>
              </CardBody>
              <CardFooter>
                <p>Amount Due: ${balance}</p>
              </CardFooter>
            </Card>
          )
        )}
      </Tab>
      <Tab title="Previous Pickups">
        {previousPrescriptions.map(
          ({ id, name, Location, LockerBox, balance, pickupCode }) => (
            <Card
              key={id}
              pad="medium"
              margin="medium"
              gap="medium"
              background={theme.global.colors['light-1']}
            >
              <CardHeader>{name}</CardHeader>
              <CardBody>
                <Box>
                  <div>{Location.streetAddress}</div>
                  <div>{Location.phoneNumber}</div>
                  <div>Lockerbox: {LockerBox.label}</div>
                  <Box align="start" pad="none">
                    <Button
                      label="QR Code"
                      onClick={() => {
                        setQrCode(pickupCode)
                        setShowQrCode(true)
                      }}
                      style={{
                        background: theme.global.colors['status-ok'],
                        borderRadius: '4px'
                      }}
                      size="medium"
                    />
                  </Box>
                </Box>
              </CardBody>
              <CardFooter>
                <p>Amount Paid: ${balance}</p>
              </CardFooter>
            </Card>
          )
        )}
      </Tab>
    </Tabs>
  )
}

export default PatientPrescriptions
