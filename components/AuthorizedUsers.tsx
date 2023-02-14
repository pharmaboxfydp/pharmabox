import { Close } from '@carbon/icons-react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
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
import { Role, User } from '../types/types'

function AuthorizedUserCard({
  user,
  currentUser
}: {
  user: User
  currentUser: User
}) {
  const { user: clerkUser } = useClerkUser(user.id)
  const { revokeAuthorization } = useAuthorization(currentUser)
  const profileImageUrl = clerkUser?.profile_image_url

  function handleRevokeAuthorization() {
    if (user && user.role && user.id) {
      revokeAuthorization({ targetUserId: user.id, targetUserRole: user.role })
    }
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
        {currentUser?.Pharmacist?.isOnDuty && (
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
      <CardBody>
        <Box
          round
          background={
            user.role === Role.Pharmacist
              ? theme.global.colors['neutral-3']
              : theme.global.colors['neutral-4']
          }
          style={{ color: theme.global.colors.white, width: 'fit-content' }}
        >
          <Tag name="Role" value={capitalize(user.role)} size="small" />
        </Box>
      </CardBody>
    </Card>
  )
}

export default function AuthorizedUsers({ user }: { user: User }) {
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
      <Grid columns={size !== 'small' ? 'small' : '100%'} gap="small">
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
