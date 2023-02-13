import {
  DataTable,
  Text,
  Box,
  Select,
  Button,
  Layer,
  Spinner,
  Tip,
  CheckBox
} from 'grommet'
import useTeam from '../hooks/team'
import { Permissions, Role, User } from '../types/types'
import Skeleton from 'react-loading-skeleton'
import {
  CircleDash,
  CircleSolid,
  Close,
  ErrorFilled
} from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import { Pharmacist, Staff } from '@prisma/client'
import usePermissions from '../hooks/permissions'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { capitalize } from 'lodash'
import useRole from '../hooks/role'
import useAuthorization, {
  GrantOrRevokeAuthorization
} from '../hooks/authorization'

export interface HandleAuthorizationChange extends GrantOrRevokeAuthorization {
  isAuthorized: boolean
}

const ActiveTag = () => (
  <Box direction="row" gap="small" animation="fadeIn" align="center">
    <Text size="small">Active</Text>
    <CircleSolid size={16} color={theme.global.colors['status-ok']} />
  </Box>
)

const InactiveTag = () => (
  <Box direction="row" gap="small" animation="fadeIn" align="center">
    <Text size="small">Inactive</Text>
    <CircleDash size={16} color={theme.global.colors['status-warning']} />
  </Box>
)

export default function TeamMembersTable({ user }: { user: User }) {
  const [showRemoveUser, setShowRemoveUser] = useState<boolean>(false)
  const [removeUserTarget, setRemoveUserTarget] = useState<null | User>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { team, isLoading, isError, removeTeamMember } = useTeam(user)
  const { updatePermissions } = usePermissions()
  const { updateRole } = useRole()
  const {
    isAuthorized: isCurrentUserAuthorized,
    grantAuthorization,
    revokeAuthorization
  } = useAuthorization(user)

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

  function handleAuthorizationChange({
    targetUserId,
    targetUserRole,
    isAuthorized
  }: HandleAuthorizationChange) {
    /**
     * if the current user is authorized then we can revoke their authorization
     */
    if (isAuthorized) {
      revokeAuthorization({ targetUserId, targetUserRole })
    } else {
      /**
       * if the current user is not authorized then we can grant them authorization
       */
      grantAuthorization({ targetUserId, targetUserRole })
    }
  }

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
                <Text size="xsmall">
                  {firstName} {lastName}
                </Text>
              )
            },
            {
              property: 'email',
              header: <Text size="xsmall">Email</Text>,
              render: ({ email }) => <Text size="small">{email}</Text>
            },
            {
              property: 'isAuthorized',
              header: <Text size="small">Authorization</Text>,
              render: ({ Staff, Pharmacist, id: targetUserId, role }) => {
                const isAuthorized =
                  (Pharmacist?.isOnDuty || Staff?.isAuthorized) ?? false
                const isAuthorizedPharmacist =
                  user?.Pharmacist && isCurrentUserAuthorized
                const targetUserRole = role ?? Role.Staff
                return (
                  <Box align="center">
                    {isAuthorizedPharmacist ? (
                      <CheckBox
                        toggle
                        label="Active"
                        checked={isAuthorized}
                        onChange={() =>
                          handleAuthorizationChange({
                            targetUserId,
                            targetUserRole,
                            isAuthorized
                          })
                        }
                      />
                    ) : (
                      <>{isAuthorized ? <ActiveTag /> : <InactiveTag />}</>
                    )}
                  </Box>
                )
              }
            },
            {
              property: 'lastLoggedIn',
              header: <Text size="small">Last Authenticated</Text>,
              render: ({ lastLoggedIn }) => {
                const date = lastLoggedIn
                  ? (() => new Date(lastLoggedIn))().toDateString()
                  : '-'
                return <Text size="xsmall">{date}</Text>
              }
            },
            {
              property: 'role',
              header: <Text size="small">Role</Text>,
              render: ({ Staff, Pharmacist, role }) => {
                const canEdit =
                  (user.Staff?.isAdmin || user.Pharmacist?.isAdmin) &&
                  team &&
                  team?.length > 1
                const member = (Pharmacist || Staff) as Staff | Pharmacist

                if (canEdit) {
                  return (
                    <Text size="xsmall">
                      <Select
                        options={['Staff', 'Pharmacist']}
                        style={{ padding: '6px 0px 6px 10px' }}
                        defaultValue={capitalize(role)}
                        onChange={({ value }: { value: string }) => {
                          updateRole({
                            role: value.toLowerCase() as Role,
                            member
                          })
                        }}
                      >
                        {(option) => (
                          <Box pad="xsmall">
                            <Text size="xsmall">{option}</Text>
                          </Box>
                        )}
                      </Select>
                    </Text>
                  )
                }
                return <Text size="xsmall">{capitalize(role)}</Text>
              }
            },
            {
              property: 'permissions',
              header: <Text size="small">Permissions</Text>,
              render: ({ Staff, Pharmacist, role }) => {
                const isAdmin = Staff?.isAdmin || Pharmacist?.isAdmin
                const permissions = isAdmin
                  ? Permissions.Admin
                  : Permissions.Standard
                /**
                 * allow edit roles if the current user is an administrator
                 * and if there are more than one user on the team.
                 */
                const canEdit =
                  (user.Staff?.isAdmin || user.Pharmacist?.isAdmin) &&
                  team &&
                  team?.length > 1

                const member = (Pharmacist || Staff) as Staff | Pharmacist
                if (canEdit) {
                  return (
                    <Text size="xsmall">
                      <Select
                        options={[Permissions.Admin, Permissions.Standard]}
                        defaultValue={permissions}
                        onChange={({ value }) => {
                          updatePermissions({
                            value,
                            member,
                            role: role as Role
                          })
                        }}
                        style={{ padding: '6px 0px 6px 10px' }}
                      >
                        {(option) => (
                          <Box pad="xsmall">
                            <Text size="xsmall">{option}</Text>
                          </Box>
                        )}
                      </Select>
                    </Text>
                  )
                }
                return <Text size="xsmall">{permissions}</Text>
              }
            },
            {
              property: 'action',
              render: (user) => {
                return (
                  <>
                    <Tip
                      content={
                        <Text size="xsmall">
                          Remove{' '}
                          <b>
                            {user.firstName} {user.lastName}
                          </b>{' '}
                          from team?
                        </Text>
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
