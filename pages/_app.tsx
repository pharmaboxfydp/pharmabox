import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Grommet } from 'grommet'
import theme from '../styles/theme'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/nextjs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Router from 'next/router'

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false
})

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

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
