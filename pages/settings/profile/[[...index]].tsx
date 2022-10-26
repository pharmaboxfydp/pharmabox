import { UserProfile } from '@clerk/nextjs'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../../helpers/user-details'
import Head from 'next/head'
import Page from '../../../components/Page'
import { ServerPageProps } from '../../../types/types'
import { Anchor, Box, Text } from 'grommet'
import theme from '../../../styles/theme'
import { ArrowLeft } from '@carbon/icons-react'
import Link from 'next/link'
import Breadcrumbs from '../../../components/Breadcrumbs'

const UserProfilePage = ({ user }: ServerPageProps) => {
  return (
    <>
      <Head>
        <title>PharmaBox | Profile</title>
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
          <Breadcrumbs pages={['Settings', 'Profile']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" gap="medium" fill="horizontal">
              <UserProfile
                path="/settings/profile"
                routing="path"
                appearance={{
                  variables: {
                    colorPrimary: theme.global.colors['neutral-2'],
                    fontFamily: 'Europa'
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default UserProfilePage

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => SSRUser({ req, res }),
  { loadUser: true }
)
