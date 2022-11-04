import {
  DataTable,
  Text,
  Box,
  Select,
  Button,
  Layer,
  Heading,
  Spinner,
  Tip
} from 'grommet'
import useTeam from '../hooks/team'
import { Permissions, User } from '../types/types'
import Skeleton from 'react-loading-skeleton'
import { Close, ErrorFilled } from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import { Staff } from '@prisma/client'
import useRole from '../hooks/role'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function TeamMembersTable({ user }: { user: User }) {
  const [showRemoveUser, setShowRemoveUser] = useState<boolean>(false)
  const [removeUserTarget, setRemoveUserTarget] = useState<null | User>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { team, isLoading, isError, removeTeamMember } = useTeam(user)

  function stopUserRemove() {
    setShowRemoveUser(false)
    setRemoveUserTarget(null)
  }
  async function handleUserRemove() {
    setIsFetching(true)
    if (removeUserTarget?.Staff?.id) {
      await removeTeamMember({
        userId: removeUserTarget.Staff.userId
      })
      stopUserRemove()
      setIsFetching(false)
      return true
    } else {
      toast.error('Unable to remove user', { icon: '❌' })
      setIsFetching(false)
      stopUserRemove()
      return false
    }
  }

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
                const date = lastLoggedIn
                  ? (() => new Date(lastLoggedIn))().toDateString()
                  : '-'
                return <Text size="small">{date}</Text>
              }
            },
            {
              property: 'role',
              header: <Text size="small">Role</Text>,
              render: ({ Staff }) => {
                const isAdmin = Staff?.isAdmin
                const role = isAdmin ? Permissions.Admin : Permissions.Member
                /**
                 * allow edit roles if the current user is an administrator
                 * and if there are more than one user on the team.
                 */
                const canEdit = user.Staff?.isAdmin && team && team?.length > 1
                if (canEdit) {
                  return (
                    <Text size="small">
                      <Select
                        options={[Permissions.Admin, Permissions.Member]}
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
            },
            {
              property: 'action',
              render: (user) => {
                return (
                  <>
                    <Tip
                      content={
                        <Text size="xsmall">Remove {user.email} from team</Text>
                      }
                    >
                      <Button
                        icon={<Close size={16} />}
                        a11yTitle="Remove user from team"
                        onClick={() => {
                          setShowRemoveUser(true)
                          setRemoveUserTarget(user)
                        }}
                      />
                    </Tip>
                  </>
                )
              }
            }
          ]}
          step={10}
          paginate
          resizeable
          data={team ?? []}
        />
      </Box>
      {showRemoveUser && (
        <Layer onEsc={stopUserRemove} onClickOutside={stopUserRemove}>
          <Box pad="medium">
            {!isFetching ? (
              <>
                <Box flex={false} direction="row" justify="between">
                  <Box pad="small">
                    <Text size="medium" weight="bold">
                      Remove Teammate
                    </Text>
                  </Box>
                  <Button icon={<Close size={16} />} onClick={stopUserRemove} />
                </Box>
                <Box pad="small" gap="medium">
                  <Text size="small">
                    Remove {removeUserTarget?.email} from your team?
                  </Text>
                  <Box flex={false} direction="row" justify="between">
                    <Button
                      label="Cancel"
                      size="small"
                      onClick={stopUserRemove}
                    />
                    <Button
                      label="Remove Team Member"
                      primary
                      size="small"
                      color={theme.global.colors['status-critical']}
                      onClick={handleUserRemove}
                    />
                  </Box>
                </Box>
              </>
            ) : (
              <Box pad="large" align="center" gap="medium" animation="fadeIn">
                <Text>Removing Teammate...</Text>
                <Spinner
                  size="xlarge"
                  border={false}
                  background="linear-gradient(to right, #fc466b, #683ffb)"
                />
              </Box>
            )}
          </Box>
        </Layer>
      )}
    </>
  )
}
