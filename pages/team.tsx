import Head from 'next/head'

import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps, UserWithPrescriptions } from '../types/types'
import { Box, Header, Text } from 'grommet'
import Breadcrumbs from '../components/Breadcrumbs'
import TeamMembersTable from '../components/TeamMembersTable'
import InviteStaff from '../components/InviteStaff'
import AuthorizedUsers from '../components/AuthorizedUsers'

const Team = ({ user }: ServerPageProps) => {
  const isCurrentUserAdmin = user.Staff?.isAdmin || user.Pharmacist?.isAdmin
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
                <Text>Active Team</Text>
              </Header>
              <AuthorizedUsers user={user} />
              <Header>
                <Text>Team Members</Text>
                <Box> {isCurrentUserAdmin && <InviteStaff user={user} />}</Box>
              </Header>
              <TeamMembersTable user={user} />
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
    SSRUser({
      req,
      res,
      query: { include: { Staff: true, Pharmacist: true } }
    }),
  { loadUser: true }
)
