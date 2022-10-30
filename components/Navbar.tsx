import { useUser } from '@clerk/nextjs'
import { Avatar, Box, Button, Header, Nav, Spinner } from 'grommet'
import Image from 'next/image'
import Link from 'next/link'
import theme from '../styles/theme'
import Logo from '../public/pharmabox_logo.svg'

function NavUserIcon() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return (
      <Box gap="small" direction="row" animation="fadeIn">
        <Box
          pad="small"
          background={theme.global.colors['neutral-6']}
          width="xsmall"
          round="xsmall"
          animation="fadeIn"
        />
        <Spinner
          round="full"
          border={false}
          size="small"
          background={`linear-gradient(to right, ${theme.global.colors['accent-1']}, ${theme.global.colors['accent-4']})`}
        />
      </Box>
    )
  }

  if (!isSignedIn) {
    /** return null just incase */
    return null
  }

  return (
    <Link href="/settings/profile" passHref>
      <Button
        size="small"
        style={{ borderRadius: '4px' }}
        color={theme.global.colors['neutral-2']}
        icon={
          <Avatar src={user.profileImageUrl} size="xsmall" animation="fadeIn" />
        }
        a11yTitle="Visit User Profile"
        hoverIndicator
        label={user.firstName}
        tip={{
          content: 'Profile'
        }}
      />
    </Link>
  )
}

export default function Navbar() {
  return (
    <Header
      background={theme.global.colors['neutral-2']}
      height="xxsmmall"
      border={{
        color: theme.global.colors['light-1'],
        side: 'bottom',
        size: 'xsmall',
        style: 'inset'
      }}
      pad="small"
    >
      <Box direction="row" align="center" alignContent="start">
        <Box margin={{ horizontal: 'medium' }}>
          <Link href="/home" passHref>
            <Button plain a11yTitle="Pharmabox">
              <Image src={Logo} alt="Pharmabox" height={18} width={124.5} />
            </Button>
          </Link>
        </Box>
      </Box>
      <Nav direction="row">
        <NavUserIcon />
      </Nav>
    </Header>
  )
}
