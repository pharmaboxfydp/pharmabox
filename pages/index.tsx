import Head from 'next/head'

import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import { Box, Text } from 'grommet'

const Home = ({ user }: ServerPageProps) => {
  if (!user) {
    return (
      <Box pad="medium">
        <Text>User Not Found. Try refreshing your browser</Text>
      </Box>
    )
  }
  return (
    <>
      <Head>
        <title>PharmaBox</title>
        <meta
          name="description"
          content="Pharmabox Homepage. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
        <Box pad="medium">
          <Text>Hello {user?.id}</Text>
          <Text>You are a {user?.role}</Text>
          <Text>Your Email is: {user?.email}</Text>
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
