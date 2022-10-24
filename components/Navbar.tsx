import { useUser } from '@clerk/nextjs'
import { Avatar, Box, Header, Nav, Spinner } from 'grommet'
import theme from '../styles/theme'

function NavUserIcon() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return <Spinner />
  }
  if (!isSignedIn) {
    return null
  }
  return <Avatar src={user.profileImageUrl} size="small" />
}

export default function Navbar() {
  return (
    <Header
      background={theme.global.colors['neutral-5']}
      height="xxsmmall"
      border={{
        color: theme.global.colors['light-1'],
        side: 'bottom',
        size: 'xsmall',
        style: 'inset'
      }}
      pad="small"
    >
      <Box></Box>
      <Nav direction="row">
        <NavUserIcon />
      </Nav>
    </Header>
  )
}
