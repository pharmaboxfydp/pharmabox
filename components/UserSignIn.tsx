import { SignIn, SignUp } from '@clerk/nextjs'
import { Box, Clock } from 'grommet'
import Image from 'next/image'
import { useRouter } from 'next/router'
import theme from '../styles/theme'
import Logo from '../public/pharmabox_logo.svg'
import { useEffect, useState } from 'react'
import { useClerk, useUser, SignedOut, SignedIn } from '@clerk/nextjs'
import styles from '../styles/Home.module.css'

export default function UserSignIn() {
  const [loaded, setLoaded] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => setLoaded(true), [])

  return (
    <Box
      align="center"
      pad="large"
      fill
      direction="column"
      gap="medium"
      className="moving-gradient"
      overflow="scroll"
    >
      <Image
        src={Logo}
        height={18 * 2}
        width={124.5 * 2}
        alt="Pharmabox Logo"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      />
      {loaded && (
        <Clock
          type="digital"
          a11yTitle="Time"
          style={{ color: theme.global.colors.white }}
        />
      )}
      <SignedOutCards />
    </Box>
  )
}
const SignedOutCards = () => {
  const { openSignIn, openSignUp } = useClerk()
  return (
    <>
      <a onClick={() => openSignIn()} className={styles.card}>
        <h2>Sign in &rarr;</h2>
        <p>Show the sign in modal</p>
      </a>
      <a onClick={() => openSignUp()} className={styles.card}>
        <h2>Sign up &rarr;</h2>
        <p>Show the sign up modal</p>
      </a>
    </>
  )
}
