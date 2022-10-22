import { Box, Button, Main } from 'grommet'
import { Provider } from 'next-auth/providers'
import { getProviders, signIn } from 'next-auth/react'
import Head from 'next/head'
import { ProtectedRoute } from '../../types/types'

export default function SignIn({ providers }: { providers: Provider[] }) {
  return (
    <>
      <Head>
        <title>Sign In</title>
        <meta
          name="Sign in to PharmaBox"
          content="Sign in to Pharmabox as a patient"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main pad="large">
        <Box align="center" gap="small" border round pad="large">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button
                onClick={() => signIn(provider.id)}
                label={`Sign in with ${provider.name}`}
              />
            </div>
          ))}
        </Box>
      </Main>
    </>
  )
}

export async function getServerSideProps(): Promise<{ props: ProtectedRoute }> {
  const providers = await getProviders()
  return {
    props: {
      providers,
      page: '/signin',
      protected: false,
      allowedRoles: ['patient', 'staff']
    }
  }
}
