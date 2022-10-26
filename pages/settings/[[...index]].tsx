import Head from 'next/head'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../helpers/user-details'
import Page from '../../components/Page'
import { ServerPageProps } from '../../types/types'
import { Anchor, Box, Button, Text } from 'grommet'
import Breadcrumbs from '../../components/Breadcrumbs'
import Link from 'next/link'
import { Information, UserProfile } from '@carbon/icons-react'
import theme from '../../styles/theme'
const Settings = ({ user }: ServerPageProps) => {
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
          <Breadcrumbs pages={['Settings']} />
          <Box direction="row" border="top" fill>
            <Box pad="medium" gap="medium" border="right" flex="grow">
              <Box direction="row" gap="small">
                <Information size={20} />
                <Text size="small">Information</Text>
              </Box>
              <Link href="/settings/profile" passHref>
                <Anchor
                  icon={<UserProfile size={24} />}
                  label="Profile"
                  size="small"
                />
              </Link>
            </Box>
            <Box pad="medium" basis="auto" fill="horizontal">
              This is some content
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default Settings

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) => SSRUser({ req, res }),
  { loadUser: true }
)
