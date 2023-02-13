import { Box, Card, Text } from 'grommet'
import useTeam from '../hooks/team'
import { User } from '../types/types'

function AuthorizedUserCard({ user }: { user: User }) {
  return (
    <Card height="xsmall" width="small" background="light-1">
      <Text>{user.firstName}</Text>
    </Card>
  )
}

export default function AuthorizedUsers({ user }: { user: User }) {
  const { authorizedTeamStaff, onDutyTeamPharmacists } = useTeam(user)
  if (!authorizedTeamStaff?.length && !onDutyTeamPharmacists?.length) {
    return (
      <Box border round="small" fill pad="small" gap="small" align="center">
        <Text size="xsmall">No active team members.</Text>
      </Box>
    )
  }
  return (
    <Box direction="row" border round="small" fill pad="small" gap="small">
      {onDutyTeamPharmacists?.map((staff) => (
        <AuthorizedUserCard user={staff} key={staff.id} />
      ))}
      {authorizedTeamStaff?.map((staff) => (
        <AuthorizedUserCard user={staff} key={staff.id} />
      ))}
    </Box>
  )
}
