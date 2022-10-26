import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Grommet, ThemeType } from 'grommet'
import theme from '../styles/theme'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn
} from '@clerk/nextjs'
import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import Router, { useRouter } from 'next/router'
import SignInPage from './sign-in/[[...index]]'

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
  const router = useRouter()
  return (
    <Grommet theme={theme as unknown as ThemeType} full>
      <ClerkProvider {...pageProps}>
        <SignedIn>
          <Component {...pageProps} />
        </SignedIn>
        <SignedOut>
          <SignIn redirectUrl={router.pathname} />
        </SignedOut>
      </ClerkProvider>
    </Grommet>
  )
}

export default App
