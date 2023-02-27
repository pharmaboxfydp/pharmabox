import Head from 'next/head'
import { Anchor, Box, Header, PageContent, PageHeader, Text } from 'grommet'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Page from '../../components/Page'
import { ServerPageProps } from '../../types/types'
import Breadcrumbs from '../../components/Breadcrumbs'
import { useRouter } from 'next/router'
import usePatient from '../../hooks/patient'
import { formatPhoneNumber } from '../../helpers/validators'

const PatientPage = ({ user: currentUser }: ServerPageProps) => {
  const router = useRouter()
  const { patientId } = router.query

  // cast to string to be safe
  const { patient, error } = usePatient(`${patientId}`)

  let patientFirstName: string | undefined
  let patientLastName: string | undefined
  let patientEmail: string | undefined
  let patientPhoneNumber: string | undefined
  let patientFullName: string | undefined
  let patientPickupEnabled: boolean = false

  if (patient && !error) {
    const { User, pickupEnabled } = patient
    patientFirstName = User?.firstName ?? '...'
    patientLastName = User?.lastName ?? '...'
    patientEmail = User?.email ?? '...@...'
    patientPhoneNumber = User?.phoneNumber ?? '(...) ... ...'
    patientPickupEnabled = pickupEnabled
    patientFullName = `${patientFirstName} ${patientLastName}` ?? '... ...'
  }

  return (
    <>
      <Head>
        <title>Patients | {patientFullName}</title>
        <meta
          name="description"
          content="Pharmabox Notifications. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={currentUser}>
        <Box
          animation="fadeIn"
          direction="column"
          align="start"
          className="Settings"
          fill="horizontal"
        >
          <Box basis="auto" fill="horizontal">
            <Header>
              <Box>
                <Breadcrumbs pages={['Patients', `${patientFullName}`]} />
              </Box>
            </Header>
            <Box pad="medium">
              <Box
                direction="row"
                gap="medium"
                border
                pad="small"
                round="small"
              >
                <Box direction="column" gap="small">
                  <Text size="xsmall">First Name:</Text>
                  <Text>{patientFirstName}</Text>
                </Box>
                <Box direction="column" gap="small">
                  <Text size="xsmall">Last Name:</Text>
                  <Text>{patientLastName}</Text>
                </Box>
                <Box direction="column" gap="small">
                  <Text size="xsmall">Email</Text>
                  <Anchor
                    weight="normal"
                    target="_blank"
                    href={`mailto:${patientEmail}`}
                  >
                    {patientEmail}
                  </Anchor>
                </Box>
                <Box direction="column" gap="small">
                  <Text size="xsmall">Phone Number</Text>
                  <Anchor
                    weight="normal"
                    target="_blank"
                    href={`tel:${patientPhoneNumber}`}
                  >
                    {formatPhoneNumber(`${patientPhoneNumber}`)}
                  </Anchor>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default PatientPage

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({
      req,
      res,
      query: { include: { Staff: true, Pharmacist: true } }
    }),
  { loadUser: true }
)
