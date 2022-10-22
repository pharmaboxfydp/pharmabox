import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from 'next-auth/react'
import { UserRole } from '../components/user-role'
import { ProtectedRoute } from '../types/types'
import { useRouter } from 'next/router'
import { Box, Grommet, Spinner, Text } from 'grommet'
import theme from '../styles/theme'
import GradientLoader from '../components/gradient-loader'

function Protector(props: React.PropsWithChildren<ProtectedRoute>) {
  const { data, status } = useSession()

  if (status === 'loading') {
    return <GradientLoader />
  }

  if (!data) {
    return <div>Login to continue</div>
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
