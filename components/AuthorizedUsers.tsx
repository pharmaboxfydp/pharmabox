import {
  Avatar,
  Box,
  Card,
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
import { User } from '../types/types'

function AuthorizedUserCard({ user }: { user: User }) {
  const { user: clerkUser } = useClerkUser(user.id)
  const profileImageUrl = clerkUser?.profile_image_url
  return (
    <Card
      height="xsmall"
      background="light-1"
      width="medium"
      animation="slideUp"
      pad="small"
    >
      <CardHeader>
        <Box direction="row" gap="small">
          <Avatar src={profileImageUrl} size="xsmall" animation="fadeIn" />
          <Text size="xsmall">
            {user.firstName} {user.lastName}
          </Text>
        </Box>
        <Tag name="Role" value={capitalize(user.role)} size="xsmall" />
      </CardHeader>
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
