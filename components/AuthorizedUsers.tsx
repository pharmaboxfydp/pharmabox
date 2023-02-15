import { Close } from '@carbon/icons-react'
import { Prescription } from '@prisma/client'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  ResponsiveContext,
  Tag,
  Text
} from 'grommet'
import { capitalize } from 'lodash'
import { useContext } from 'react'
import useAuthorization from '../hooks/authorization'
import useTeam from '../hooks/team'
import useClerkUser from '../hooks/users'
import theme from '../styles/theme'
import { Role, User, UserWithPrescriptions } from '../types/types'

function AuthorizedUserCard({
  user,
  currentUser
}: {
  user: UserWithPrescriptions
  currentUser: User
}) {
  const { id, role } = user
  const { user: clerkUser } = useClerkUser(id)
  const { revokeAuthorization, isAuthorized } = useAuthorization(currentUser)
  const profileImageUrl = clerkUser?.profile_image_url

  function handleRevokeAuthorization() {
    if (user && role && id) {
      revokeAuthorization({ targetUserId: id, targetUserRole: role })
    }
  }
  let activePrescriptions: Prescription[] = []
  let authorizer: string = 'Self Authorized'
  if (role === Role.Pharmacist) {
    activePrescriptions = user.Pharmacist.Prescription
  }
  if (role === Role.Staff) {
    activePrescriptions = user.Staff.Prescription
    const { firstName, lastName } = user?.Staff?.authorizer.User
    authorizer = `${firstName} ${lastName}`
  }
  return (
    <Card
      background="light-1"
      animation="slideUp"
      pad="small"
      width="small"
      gap="small"
    >
      <CardHeader>
        <Box direction="row" flex="grow" gap="small">
          <Avatar src={profileImageUrl} size="xsmall" animation="fadeIn" />
          <Text size="xsmall">
            {user.firstName} {user.lastName}
          </Text>
        </Box>
        {isAuthorized && currentUser.role === Role.Pharmacist && (
          <Button
            style={{ padding: '4px' }}
            icon={<Close size={16} />}
            focusIndicator
            onClick={handleRevokeAuthorization}
            tip={{
              content: (
                <Text size="xsmall" color={theme.global.colors['status-error']}>
                  Revoke Authorization
                </Text>
              )
            }}
          />
        )}
      </CardHeader>
      <CardBody gap="small">
        <Box
          round
          background={
            user.role === Role.Pharmacist
              ? theme.global.colors['neutral-3']
              : theme.global.colors['neutral-4']
          }
          style={{ color: theme.global.colors.white, width: 'fit-content' }}
        >
          <Tag name="Role" value={capitalize(user.role)} size="xsmall" />
        </Box>
        <Box direction="row" gap="small">
          <Text size="xsmall">Active Prescriptions:</Text>
          <Text size="xsmall">
            <b>{activePrescriptions?.length}</b>
          </Text>
        </Box>
      </CardBody>
      <CardFooter>
        <Box direction="row" gap="small">
          <Text size="xsmall">Supervisor:</Text>
          <Text size="xsmall">
            <b>{authorizer}</b>
          </Text>
        </Box>
      </CardFooter>
    </Card>
  )
}

export default function AuthorizedUsers({
  user
}: {
  user: UserWithPrescriptions
}) {
  const { authorizedTeamStaff, onDutyTeamPharmacists } = useTeam(user)
  const size = useContext(ResponsiveContext)
  12
  if (!authorizedTeamStaff?.length && !onDutyTeamPharmacists?.length) {
    return (
      <Box border round="small" pad="small" gap="small" align="center">
        <Text size="xsmall">No active team members.</Text>
      </Box>
    )
  }
  const currentUser = user
  return (
    <Box border round="small" flex="grow" pad="small" gap="small">
      <Grid
        columns={size !== 'small' ? 'small' : '100%'}
        gap="medium"
        pad="small"
      >
        {onDutyTeamPharmacists?.map((staff) => (
          <AuthorizedUserCard
            user={staff}
            key={staff.id}
            currentUser={currentUser}
          />
        ))}
        {authorizedTeamStaff?.map((staff) => (
          <AuthorizedUserCard
            user={staff}
            key={staff.id}
            currentUser={currentUser}
          />
        ))}
      </Grid>
    </Box>
  )
}
