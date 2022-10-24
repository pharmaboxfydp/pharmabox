import Head from 'next/head'

import { useClerk } from '@clerk/clerk-react'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import getUserDetails from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import { Box, Text } from 'grommet'
const Notifications = ({ user }: ServerPageProps) => {
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
          <Text>Notifications</Text>
        </Box>
      </Page>
    </>
  )
}

export default Notifications

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=240, stale-while-revalidate=120'
    )
    const { userId } = req.auth
    if (userId) {
      return getUserDetails(userId)
    }
    return { props: { userId } }
  },
  { loadUser: true }
)
