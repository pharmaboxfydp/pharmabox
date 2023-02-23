import Head from 'next/head'
import { Box, Header } from 'grommet'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Page from '../../components/Page'
import { ServerPageProps } from '../../types/types'
import Breadcrumbs from '../../components/Breadcrumbs'
import PatientsTable from '../../components/PatientsTable'
import AddPatientButton from '../../components/AddPatientButton'

const Patients = ({ user }: ServerPageProps) => {
  return (
    <>
      <Head>
        <title>PharmaBox | Patients</title>
        <meta
          name="description"
          content="Pharmabox Notifications. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
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
                <Breadcrumbs pages={['Patients']} />
              </Box>
              <Box pad={{ right: 'small' }}>
                <AddPatientButton user={user} />
              </Box>
            </Header>
            <Box direction="row" border="top" fill>
              <Box
                pad={{ top: 'medium', bottom: 'medium' }}
                basis="auto"
                fill="horizontal"
                gap="medium"
              >
                <PatientsTable />
              </Box>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default Patients

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({
      req,
      res,
      query: { include: { Staff: true, Pharmacist: true } }
    }),
  { loadUser: true }
)
