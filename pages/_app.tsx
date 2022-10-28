import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Grommet, ThemeType } from 'grommet'
import theme from '../styles/theme'
import { ClerkProvider, SignedIn, SignedOut, ClerkLoaded } from '@clerk/nextjs'
import NProgress from 'nprogress'
// import Router from 'next/router'
import { useRouter } from 'next/router'
// import UserSignIn from '../components/UserSignIn'

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false
})

// Router.events.on('routeChangeStart', () => NProgress.start())
// Router.events.on('routeChangeComplete', () => NProgress.done())
// Router.events.on('routeChangeError', () => NProgress.done())
const publicPages = ['/', '/sign-up', '/sign-in']

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <Grommet theme={theme as unknown as ThemeType} full>
      <ClerkProvider {...pageProps}>
        <ClerkLoaded>
          {publicPages.includes(router.pathname) ? (
            <main>
              <Component {...pageProps} />
            </main>
          ) : (
            <>
              <SignedIn>
                <Component {...pageProps} />
              </SignedIn>
              <SignedOut>
                <div className="protected">
                  <p>You need to be signed in to access this page.</p>
                </div>
              </SignedOut>
            </>
          )}
        </ClerkLoaded>
      </ClerkProvider>
    </Grommet>
  )
}

export default App
