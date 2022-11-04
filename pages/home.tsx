import Head from 'next/head'
import theme from '../styles/theme'
import useSWR from 'swr'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import {
  Box,
  Text,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Layer
} from 'grommet'
import { useEffect, useState } from 'react'
import { PrescriptionAndLocation } from '../types/types'
import QRCode from 'react-qr-code'

const Home = ({ user }: ServerPageProps) => {
  const [prescriptions, setPrescriptions] = useState<
    Array<PrescriptionAndLocation>
  >([])
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState('')
  const [showQrCode, setShowQrCode] = useState(false)

  const fetcher = (url: URL) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        patientId: user.Patient?.id
      })
    })
      .then((response) => response.json())
      .catch()
      .finally(() => setLoading(false))
  const { data, error } = useSWR('/api/prescriptions/read', fetcher)

  const onClose = () => setShowQrCode(false)
  useEffect(() => {
    if (data) {
      setPrescriptions(data.prescription)
    }
  }, [data, error])
  if (loading) {
    return <></>
  }
  return (
    <>
      <Head>
        <title>PharmaBox</title>
        <meta
          name="description"
          content="Pharmabox Notifications. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
        {showQrCode && (
          <Layer
            id="hello world"
            position="center"
            onClickOutside={onClose}
            onEsc={onClose}
            margin="large"
          >
            <Box pad={'xlarge'}>
              <Card
                key={'qrCode'}
                pad="medium"
                margin="medium"
                justify="center"
                align="center"
                gap="medium"
                background={theme.global.colors['light-1']}
              >
                <CardHeader>
                  <h2>Scan To Unlock</h2>
                </CardHeader>
                <CardBody>
                  <QRCode value={qrCode} />
                </CardBody>
                <CardFooter>
                  <Button
                    label="Close"
                    margin={'large'}
                    onClick={onClose}
                    style={{
                      background: theme.global.colors['status-critical'],
                      borderRadius: '4px'
                    }}
                    size="large"
                  />
                </CardFooter>
              </Card>
            </Box>
          </Layer>
        )}
        <Box pad="medium">
          <Tabs justify="start">
            <Tab title="Ready for Pickup">
              <Box pad="medium">
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
                          <div>{Location.address}</div>
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
              </Box>
            </Tab>
            <Tab title="Previous Pickups"></Tab>
          </Tabs>
        </Box>
      </Page>
    </>
  )
}

export default Home

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => SSRUser({ req, res }),
  { loadUser: true }
)
