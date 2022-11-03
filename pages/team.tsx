import Head from 'next/head'

import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import { Box, Card, DataTable, ResponsiveContext, Text } from 'grommet'
import Breadcrumbs from '../components/Breadcrumbs'
import { Logout } from '@carbon/icons-react'
import SidebarButton from '../components/SidebarButton'
import { useClerk } from '@clerk/nextjs'
import useTeam from '../hooks/team'
const Team = ({ user }: ServerPageProps) => {
  const { signOut } = useClerk()
  const { team, isLoading, isError } = useTeam(user)
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
          <Breadcrumbs pages={['Team']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" basis="auto" fill="horizontal" gap="medium">
              <Text>Team Members</Text>
              <Card pad="medium">
                {!isLoading && !isError && (
                  <DataTable
                    columns={[
                      {
                        property: 'firstName',
                        primary: true,
                        header: <Text>First Name</Text>
                      },
                      { property: 'lastName', header: <Text>Last Name</Text> },
                      { property: 'email', header: <Text>Email</Text> }
                    ]}
                    data={team ?? []}
                  />
                )}
              </Card>
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
