import Head from 'next/head'

import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import { Box, Text } from 'grommet'
const Patients = ({ user }: ServerPageProps) => {
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
        <Box pad="medium">
          <Text>Patients</Text>
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
