import { Box, Main, Nav } from 'grommet'
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'
import { User } from '../types/types'
import Protector from './Protector'

export default function Page({
  user,
  children
}: PropsWithChildren<{ user: User }>) {
  return (
    <Box direction="row" fill>
      <Sidebar role={user.role} />
      <Protector role={user.role}>{children}</Protector>
    </Box>
  )
}
