import Head from 'next/head'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Page from '../../components/Page'
import { Role, ServerPageProps } from '../../types/types'
import { Anchor, Box, Text, ResponsiveContext, Button } from 'grommet'
import Breadcrumbs from '../../components/Breadcrumbs'
import Link from 'next/link'
import { Information, UserProfile } from '@carbon/icons-react'
import PatientSettings from '../../components/PatientSettings'
import StaffAndPharmacistSettings from '../../components/StaffAndPharmacistSettings'
import { Logout } from '@carbon/icons-react'
import SidebarButton from '../../components/SidebarButton'
import { useClerk } from '@clerk/clerk-react'

const Settings = ({ user }: ServerPageProps) => {
  const { signOut } = useClerk()
  return (
    <>
      <Head>
        <title>PharmaBox | Settings</title>
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
          <Breadcrumbs pages={['Settings']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" gap="medium" border="right" flex="grow">
              <Box direction="row" gap="small">
                <Information size={20} />
                <Text size="small">Settings</Text>
              </Box>
              <Link href="/settings/profile" passHref>
                <Anchor
                  icon={<UserProfile size={20} />}
                  label="Profile"
                  size="small"
                />
              </Link>
            </Box>
            <Box pad="small" basis="auto" fill="horizontal" gap="small">
              {user.role === Role.Patient && <PatientSettings user={user} />}
              {(user.role === Role.Staff || user.role === Role.Pharmacist) && (
                <StaffAndPharmacistSettings user={user} />
              )}

              <div>
                <ResponsiveContext.Consumer>
                  {(responsive) =>
                    responsive === 'small' ? (
                      <SidebarButton
                        icon={<Logout size={24} />}
                        label={'Logout'}
                        onClick={signOut}
                      />
                    ) : (
                      <></>
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

export default Settings

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({
      req,
      res,
      query: { include: { Staff: true, Patient: true, Pharmacist: true } }
    }),
  { loadUser: true }
)
