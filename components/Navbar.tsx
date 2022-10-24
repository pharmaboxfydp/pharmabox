import { Avatar, Box, Header, Nav } from 'grommet'
import { User } from '../types/types'

export default function Navbar({ user }: { user?: User }) {
  return (
    <Box>
      <Header>
        <Nav>
          <Avatar />
        </Nav>
      </Header>
    </Box>
  )
}
