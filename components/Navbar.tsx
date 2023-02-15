import { useUser } from '@clerk/nextjs'
import { Avatar, Box, Button, Header, Nav, Spinner, Text } from 'grommet'
import Image from 'next/image'
import Link from 'next/link'
import theme from '../styles/theme'
import Logo from '../public/pharmabox_logo.svg'
import { Role, User } from '../types/types'
import AuthorizationToggle from './AuthorizationToggle'
import useAuthorization from '../hooks/authorization'

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

export default function Navbar({ user }: { user: User }) {
  const { isAuthorized, user: userWithSupervisor } = useAuthorization(user)
  let authorizerName: string = ''
  const showAuthoriser: boolean = user.role === Role.Staff && isAuthorized
  if (showAuthoriser) {
    const firstName = userWithSupervisor?.authorizer.User.firstName
    const lastName = userWithSupervisor?.authorizer.User.lastName
    authorizerName = `${firstName} ${lastName}`
  }
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
        {user.role === Role.Staff && showAuthoriser && (
          <Box direction="row" align="center" gap="xsmall">
            <Text size="small">Supervising Pharmacist:</Text>
            <Text size="small">
              <b>{authorizerName}</b>
            </Text>
          </Box>
        )}
        {user.role === Role.Pharmacist && <AuthorizationToggle user={user} />}
        <NavUserIcon />
      </Nav>
    </Header>
  )
}
