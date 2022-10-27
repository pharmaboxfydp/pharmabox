import { SignIn } from '@clerk/nextjs'
import { Box, Clock } from 'grommet'
import Image from 'next/image'
import { useRouter } from 'next/router'
import theme from '../styles/theme'
import Logo from '../public/pharmabox_logo.svg'
import { useEffect, useState } from 'react'

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
      <SignIn
        redirectUrl={router.pathname}
        appearance={{
          variables: {
            colorPrimary: theme.global.colors['neutral-2'],
            fontFamily: 'Europa'
          }
        }}
      />
    </Box>
  )
}
