import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Box, Button, Grommet, Spinner, Text } from 'grommet'
import theme from '../styles/theme'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/nextjs'

function App({ Component, pageProps }: AppProps) {
  return (
    <Grommet theme={theme}>
      <ClerkProvider {...pageProps}>
        <SignedIn>
          <Component {...pageProps} />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkProvider>
    </Grommet>
  )
}

export default App
