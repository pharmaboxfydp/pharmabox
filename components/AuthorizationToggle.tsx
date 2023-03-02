import { Box, CheckBox } from 'grommet'
import useAuthorization from '../hooks/authorization'
import { Role, User } from '../types/types'

export default function AuthorizationToggle({ user }: { user: User }) {
  const {
    isAuthorized,
    isLoading,
    isError,
    grantAuthorization,
    revokeAuthorization
  } = useAuthorization(user)

  function handleChange() {
    if (isAuthorized) {
      revokeAuthorization({
        targetUserId: user.id,
        targetUserRole: Role.Pharmacist
      })
    } else {
      grantAuthorization({
        targetUserId: user.id,
        targetUserRole: Role.Pharmacist
      })
    }
  }
  return (
    <Box pad="xxsmall" animation="fadeIn">
      <CheckBox
        toggle
        label="Active"
        checked={isAuthorized}
        a11yTitle="Grant authorization to yourself to use the service"
        onChange={handleChange}
        data-cy="pharmacist-authorization-toggle"
      />
    </Box>
  )
}
