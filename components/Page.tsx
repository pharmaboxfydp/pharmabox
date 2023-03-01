import { Box, ResponsiveContext } from 'grommet'
import { PropsWithChildren } from 'react'
import Sidebar from './Sidebar'
import { User } from '../types/types'
import Protector from './Protector'
import PageErrorBoundary from './PageErrorBoundary'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import CreatePrescriptionModal from './CreatePrescriptionModal'

export default function Page({
  user,
  children
}: PropsWithChildren<{ user: User }>) {
  return (
    <Box direction="column" fill>
      <Navbar user={user} />
      <ResponsiveContext.Consumer>
        {(responsive) =>
          responsive === 'small' ? (
            <Box direction="row" fill>
              <Box overflow="scroll" fill="horizontal">
                <Box fill>
                  <PageErrorBoundary>
                    <Protector role={user.role}>
                      <>
                        {children}
                        <CreatePrescriptionModal user={user} />
                      </>
                    </Protector>
                  </PageErrorBoundary>
                </Box>
                <MobileNav role={user.role} />
              </Box>
            </Box>
          ) : (
            <Box direction="row" fill>
              <Sidebar role={user.role} />
              <Box overflow="scroll" fill="horizontal">
                <Box fill>
                  <PageErrorBoundary>
                    <Protector role={user.role}>{children}</Protector>
                  </PageErrorBoundary>
                </Box>
              </Box>
            </Box>
          )
        }
      </ResponsiveContext.Consumer>
    </Box>
  )
}
