import Head from 'next/head'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { Role, ServerPageProps } from '../types/types'
import { Box } from 'grommet'

import PatientHomePage from '../components/PatientHomePage'
import Breadcrumbs from '../components/Breadcrumbs'
import StaffHomePage from '../components/StaffHomePage'

const Home = ({ user }: ServerPageProps) => {
  return (
    <>
      <Head>
        <title>PharmaBox | Home</title>
        <meta
          name="description"
          content="Pharmabox Notifications. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
        <Box animation="fadeIn" fill className="logbook">
          <Breadcrumbs pages={['Home']} />
          <Box border="top" fill pad="medium">
            {/**
             * do an exact match so that we never conditinally render the wrong page
             */}
            {user.role === Role.Patient && <PatientHomePage user={user} />}
            {user.role === Role.Staff && <StaffHomePage user={user} />}
          </Box>
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
