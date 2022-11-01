import { Anchor, Box, Button, Card, Clock, Footer, Text } from 'grommet'
import Image from 'next/image'
import theme from '../styles/theme'
import Logo from '../public/pharmabox_logo.svg'
import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { FaceAdd, Login } from '@carbon/icons-react'
import Lottie from 'lottie-react'
import loginAnimation from '../public/assets/avatar.json'
import Link from 'next/link'

export default function UserSignIn() {
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => setLoaded(true), [])

  return (
    <Box className="moving-gradient" fill>
      <Box
        align="center"
        pad="large"
        fill
        direction="column"
        gap="medium"
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
      <Footer pad="small" justify="center">
        <Text color={theme.global.colors.white}>
          Pharmabox © {new Date().getFullYear()}. Made with ❤️ by{' '}
          <Link href="https://github.com/pharma-box" passHref>
            <Anchor color={theme.global.colors.white}>these people</Anchor>
          </Link>
        </Text>
      </Footer>
    </Box>
  )
}
const SignedOutCards = () => {
  const { openSignIn, openSignUp } = useClerk()
  return (
    <Card
      pad="large"
      gap="medium"
      background={theme.global.colors.white}
      align="center"
      width="medium"
    >
      <Lottie
        animationData={loginAnimation}
        style={{ height: '64px' }}
        autoPlay
        loop={false}
      />
      <Box align="center" gap="xsmall">
        <Button
          icon={<Login size={20} />}
          fill="horizontal"
          primary
          onClick={() => openSignIn()}
          label="Sign In"
          style={{ borderRadius: '24px' }}
        />
        <Text size="xsmall">Or</Text>
        <Button
          icon={<FaceAdd size={20} />}
          secondary
          label="Sign Up"
          onClick={() => openSignUp()}
          style={{ borderRadius: '24px' }}
        />
      </Box>
    </Card>
  )
}
