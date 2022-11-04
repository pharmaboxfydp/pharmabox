import { DataTable, Text, Box, Select } from 'grommet'
import useTeam from '../hooks/team'
import { User } from '../types/types'
import Skeleton from 'react-loading-skeleton'
import { ErrorFilled } from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import { Staff } from '@prisma/client'
import useRole from '../hooks/role'

export default function TeamMembersTable({ user }: { user: User }) {
  let { team, isLoading, isError } = useTeam(user)
  const { updateRole } = useRole()
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
      <CardNotification>
        <ErrorFilled size={32} color={theme.global.colors['status-error']} />
        <Text textAlign="center">
          Oops! It looks like Pharmabox was not able to load your team. Try
          refreshing your page. If the issue persists, contact your system
          administrator.
        </Text>
      </CardNotification>
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
                /**
                 * allow edit roles if the current user is an administrator
                 * and if there are more than one user on the team.
                 */
                const canEdit = user.Staff?.isAdmin && team && team?.length > 1
                if (canEdit) {
                  return (
                    <Text size="small">
                      <Select
                        options={['Admin', 'Member']}
                        defaultValue={role}
                        onChange={({ value }) => {
                          updateRole({ value, member: Staff as Staff })
                        }}
                      >
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
