import Head from 'next/head'
import theme from '../styles/theme'
import useSWR from 'swr'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps, Status } from '../types/types'
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
import { PrescriptionAndLocation, PharmacyLocation } from '../types/types'
import QRCodeModal from '../components/QrCode'
import PatientPrescriptions from '../components/PatientPrescriptions'
import PharmacyLocationView from '../components/PharmacyLocation'
import { Prescription } from '.prisma/client'

const Home = ({ user }: ServerPageProps) => {
  const [prescriptions, setPrescriptions] = useState<
    Array<PrescriptionAndLocation>
  >([])
  const [previousPrescriptions, setPreviousPrescriptions] = useState<
    Array<PrescriptionAndLocation>
  >([])
  const [pharmacyLocation, setPharmacyLocation] = useState<PharmacyLocation>()
  const [location, setLocation] = useState<Location>()
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState('')
  const [showQrCode, setShowQrCode] = useState(false)

  const fetcher = (userRole: string) => {
    if (userRole === 'patient') {
      return fetch('/api/prescriptions/read', {
        method: 'POST',
        body: JSON.stringify({
          patientId: user.Patient?.id
        })
      })
        .then((response) => response.json())
        .then((data) => {
          let prevPrescriptions: PrescriptionAndLocation[] = []
          let activePrescriptions: PrescriptionAndLocation[] = []

          data.prescription?.forEach(
            (prescription: PrescriptionAndLocation) => {
              if (prescription.status === Status.AwaitingPickup) {
                activePrescriptions.push(prescription)
              } else if (prescription.status === Status.PickupCompleted) {
                prevPrescriptions.push(prescription)
              }
            }
          )
          setPreviousPrescriptions(prevPrescriptions)
          setPrescriptions(activePrescriptions)
        })
        .catch()
        .finally(() => setLoading(false))
    } else if (userRole === 'staff') {
      return fetch('/api/locations/read', {
        method: 'POST',
        body: JSON.stringify({
          id: user.Staff?.locationId
        })
      })
        .then((response) => response.json())
        .then((data) => {
          setPharmacyLocation(data.location)
        })
        .catch()
        .finally(() => setLoading(false))
    }
  }

  const { data, error } = useSWR(user.role, fetcher)

  const onClose = () => setShowQrCode(false)

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
        {showQrCode && <QRCodeModal qrCode={qrCode} onClose={onClose} />}
        <Box pad="medium">
          {user.role === 'patient' ? (
            <PatientPrescriptions
              prescriptions={prescriptions}
              previousPrescriptions={previousPrescriptions}
              setQrCode={setQrCode}
              setShowQrCode={setShowQrCode}
            />
          ) : (
            <PharmacyLocationView pharmacyLocation={pharmacyLocation} />
          )}
        </Box>
      </Page>
    </>
  )
}

export default Home

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({ req, res, query: { include: { Staff: true, Patient: true } } }),
  { loadUser: true }
)
