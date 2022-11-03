import { DataTable, Text, Box, Card, Select } from 'grommet'
import useTeam from '../hooks/team'
import { User } from '../types/types'
import Skeleton from 'react-loading-skeleton'
import { ErrorFilled } from '@carbon/icons-react'
import theme from '../styles/theme'

export default function TeamMembersTable({ user }: { user: User }) {
  let { team, isLoading, isError } = useTeam(user)

  if (isLoading && !isError) {
    return (
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={5} height={30} style={{ lineHeight: '3' }} />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        pad="medium"
        direction="row"
        flex="grow"
        gap="medium"
        align="center"
        justify="center"
      >
        <Card align="center" gap="medium" pad="large">
          <ErrorFilled size={32} color={theme.global.colors['status-error']} />
          <Text textAlign="center">
            Oops! It looks like Pharmabox was not able to load your team. Try
            refreshing your page. If the issue persists, contact your system
            administrator.
          </Text>
        </Card>
      </Box>
    )
  }

  return (
    <>
      <Box>
        <DataTable
          columns={[
            {
              property: 'Name',
              header: <Text size="small">Name</Text>,
              render: ({ firstName, lastName }) => (
                <Text size="small">
                  {firstName} {lastName}
                </Text>
              )
            },
            {
              property: 'email',
              header: <Text size="small">Email</Text>,
              render: ({ email }) => <Text size="small">{email}</Text>
            },
            {
              property: 'lastLoggedIn',
              header: <Text size="small">Last Login</Text>,
              render: ({ lastLoggedIn }) => {
                const date = new Date(lastLoggedIn)
                return <Text size="small">{date.toDateString()}</Text>
              }
            },
            {
              property: 'role',
              header: <Text size="small">Role</Text>,
              render: ({ Staff }) => {
                const isAdmin = Staff?.isAdmin
                const role = isAdmin ? 'Admin' : 'Member'
                if (user.Staff?.isAdmin) {
                  return (
                    <Text size="small">
                      <Select options={['Admin', 'Member']} defaultValue={role}>
                        {(option) => (
                          <Box pad="xsmall">
                            <Text size="small">{option}</Text>
                          </Box>
                        )}
                      </Select>
                    </Text>
                  )
                }
                return <Text size="small">{role}</Text>
              }
            }
          ]}
          step={10}
          paginate
          resizeable
          data={team ?? []}
        />
      </Box>
    </>
  )
}
