import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Grommet, Keyboard, ThemeType } from 'grommet'
import theme from '../styles/theme'
import { ClerkProvider, SignedIn, SignedOut, ClerkLoaded } from '@clerk/nextjs'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import UserSignIn from '../components/UserSignIn'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'
import Router from 'next/router'
import AddPatientModal, {
  addPatientModalState
} from '../components/AddPatientModal'
import CreatePrescriptionModal, {
  createPrescriptionModalState
} from '../components/CreatePrescriptionModal'
import { ServerPageProps } from '../types/types'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import { useAtom } from 'jotai'

try {
  TimeAgo.addLocale(en)
} catch (error) {
  // catch the error that the locale has already been created
}

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false
})

const publicPages = ['/', '/sign-up', '/sign-in']

const StyledContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    font-family: 'Europa';
  }
  .Toastify__toast {
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
    background: ${theme.global.colors['accent-1']};
  }
`

/**
 * Progress loader
 */
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false
})

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function App({ Component, pageProps }: AppProps<ServerPageProps>) {
  const router = useRouter()
  const [, setShowCreatePrescriptionModal] = useAtom(
    createPrescriptionModalState
  )
  const [, setShowAddPatientModal] = useAtom(addPatientModalState)

  function handleShortCutKeys(event: React.KeyboardEvent<HTMLElement>) {
    const { key } = event
    switch (key) {
      case 'F1': {
        setShowCreatePrescriptionModal(true)
      }
      case 'F2': {
        setShowAddPatientModal(true)
      }
      case 'F3': {
        router.push('/home')
      }
      case 'F4': {
        router.push('/patients')
      }
      case 'F5': {
        router.push('/team')
      }
      case 'F6': {
        router.push('/settings')
      }
      /**
       * F7 is a reserved key in Chrome
       */
      case 'F8': {
        router.push('/settings/profile')
      }
    }
  }
  return (
    <Grommet theme={theme as unknown as ThemeType} full>
      <ClerkProvider {...pageProps}>
        <ClerkLoaded>
          {publicPages.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <>
              <SignedIn>
                <Keyboard target="document" onKeyDown={handleShortCutKeys}>
                  <Component {...pageProps} />
                  <AddPatientModal {...pageProps} />
                  <CreatePrescriptionModal {...pageProps} />
                </Keyboard>
              </SignedIn>
              <SignedOut>
                <UserSignIn />
              </SignedOut>
            </>
          )}
          <StyledContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ClerkLoaded>
      </ClerkProvider>
    </Grommet>
  )
}

export default App
