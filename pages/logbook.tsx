import Head from 'next/head'
import { Box, Header, ResponsiveContext, Text } from 'grommet'
import SidebarButton from '../components/SidebarButton'
import { Logout } from '@carbon/icons-react'
import Lottie from 'lottie-react'
import constructionAnimation from '../public/assets/construction.json'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import Breadcrumbs from '../components/Breadcrumbs'
import { useClerk } from '@clerk/nextjs'

const Logbook = ({ user }: ServerPageProps) => {
  const { signOut } = useClerk()

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
        <Box
          animation="fadeIn"
          direction="column"
          align="start"
          fill
          className="Settings"
        >
          <Breadcrumbs pages={['Logbook']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" basis="auto" fill="horizontal" gap="medium">
              <Header>
                <Text>
                  <Text weight="bolder">Coming Soon:</Text> Presciption Pickup
                  History
                </Text>
              </Header>
              <Box pad="large">
                <Lottie
                  animationData={constructionAnimation}
                  style={{ height: '100%' }}
                  autoPlay
                />
              </Box>
              <div>
                <ResponsiveContext.Consumer>
                  {(responsive) =>
                    responsive === 'small' && (
                      <SidebarButton
                        icon={<Logout size={24} />}
                        label={'Logout'}
                        onClick={signOut}
                      />
                    )
                  }
                </ResponsiveContext.Consumer>
              </div>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default Logbook

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => SSRUser({ req, res }),
  { loadUser: true }
)
