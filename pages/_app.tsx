import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from 'next-auth/react'
import { UserRole } from '../components/user-role'

function Protector(props: React.PropsWithChildren) {
  const { data } = useSession()
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
    <SessionProvider session={session}>
      <Protector>
        <Component {...pageProps} />
      </Protector>
    </SessionProvider>
  )
}
