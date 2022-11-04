import Head from 'next/head'

import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import { Box, Header, ResponsiveContext, Text } from 'grommet'
import Breadcrumbs from '../components/Breadcrumbs'
import { Logout } from '@carbon/icons-react'
import SidebarButton from '../components/SidebarButton'
import { useClerk } from '@clerk/nextjs'
import TeamMembersTable from '../components/TeamMembersTable'
import InviteStaff from '../components/InviteStaff'

const Team = ({ user }: ServerPageProps) => {
  const { signOut } = useClerk()

  const isCurrentUserAdmin = user.Staff?.isAdmin
  return (
    <>
      <Head>
        <title>PharmaBox | Team</title>
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
          <Breadcrumbs pages={['Team']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" basis="auto" fill="horizontal" gap="medium">
              <Header>
                <Text>Team Members</Text>
                <Box> {isCurrentUserAdmin && <InviteStaff user={user} />}</Box>
              </Header>

              <TeamMembersTable user={user} />
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

export default Team

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({ req, res, query: { include: { Staff: true } } }),
  { loadUser: true }
)
