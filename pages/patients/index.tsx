import Head from 'next/head'
import { Box } from 'grommet'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Page from '../../components/Page'
import { ServerPageProps } from '../../types/types'
import Breadcrumbs from '../../components/Breadcrumbs'
import PatientsTable from '../../components/PatientsTable'

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
          fill
          className="Settings"
        >
          <Breadcrumbs pages={['Patients']} />
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
      </Page>
    </>
  )
}

export default Patients

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => SSRUser({ req, res }),
  { loadUser: true }
)
