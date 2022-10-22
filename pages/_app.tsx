import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from 'next-auth/react'
import { UserRole } from '../components/user-role'
import { ProtectedRoute } from '../types/types'
import { useRouter } from 'next/router'
import { Box, Button, Grommet, Spinner, Text } from 'grommet'
import theme from '../styles/theme'
import GradientLoader from '../components/gradient-loader'
import Link from 'next/link'

function Protector(props: React.PropsWithChildren<ProtectedRoute>) {
  const { data, status } = useSession()
  const { page } = props
  if (status === 'loading') {
    return <GradientLoader />
  }
  if (!data && page !== '/signin') {
    return (
      <Box justify="center" align="center" pad="xlarge" gap="medium">
        <Box
          align="center"
          alignContent="center"
          animation="fadeIn"
          basis="small"
          border
          direction="column"
          pad="large"
          round
          gap="small"
        >
          <Link href="/auth/signin" passHref>
            <Button primary label="Login to Pharambox" />
          </Link>
        </Box>
      </Box>
    )
  }

  return (
    <UserRole.Provider value={data?.user?.role}>
      {props.children}
    </UserRole.Provider>
  )
}

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<Record<string, any>>) {
  return (
    <Grommet theme={theme}>
      <SessionProvider session={session}>
        <Protector {...(pageProps as ProtectedRoute)}>
          <Component {...pageProps} />
        </Protector>
      </SessionProvider>
    </Grommet>
  )
}
