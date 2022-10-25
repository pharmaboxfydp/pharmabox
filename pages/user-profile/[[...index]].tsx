import { UserProfile } from '@clerk/nextjs'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Head from 'next/head'
import Page from '../../components/Page'
import { ServerPageProps } from '../../types/types'
import { Box } from 'grommet'
import theme from '../../styles/theme'

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
        <Box pad="medium" animation="fadeIn">
          <UserProfile
            path="/user-profile"
            routing="path"
            appearance={{
              variables: {
                colorPrimary: theme.global.colors['neutral-2'],
                fontFamily: 'Europa'
              }
            }}
          />
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
