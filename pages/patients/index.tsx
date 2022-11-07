import Head from 'next/head'
import { Box, ResponsiveContext } from 'grommet'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Page from '../../components/Page'
import { ServerPageProps } from '../../types/types'
import Breadcrumbs from '../../components/Breadcrumbs'
import { useClerk } from '@clerk/nextjs'
import { Logout } from '@carbon/icons-react'
import SidebarButton from '../../components/SidebarButton'
import PatientsTable from '../../components/PatientsTable'

const Patients = ({ user }: ServerPageProps) => {
  const { signOut } = useClerk()
  return (
    <>
      <Head>
        <title>PharmaBox | Patients</title>
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
          <Breadcrumbs pages={['Patients']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" basis="auto" fill="horizontal" gap="medium">
              <PatientsTable />
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

export default Patients

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => SSRUser({ req, res }),
  { loadUser: true }
)
