import {
  Avatar,
  Box,
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
import useTeam from '../hooks/team'
import useClerkUser from '../hooks/users'
import theme from '../styles/theme'
import { Role, User } from '../types/types'

function AuthorizedUserCard({ user }: { user: User }) {
  const { user: clerkUser } = useClerkUser(user.id)
  const profileImageUrl = clerkUser?.profile_image_url
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
  return (
    <Box border round="small" flex="grow" pad="small" gap="small">
      <Grid columns={size !== 'small' ? 'small' : '100%'} gap="small">
        {onDutyTeamPharmacists?.map((staff) => (
          <AuthorizedUserCard user={staff} key={staff.id} />
        ))}
        {authorizedTeamStaff?.map((staff) => (
          <AuthorizedUserCard user={staff} key={staff.id} />
        ))}
      </Grid>
    </Box>
  )
}
