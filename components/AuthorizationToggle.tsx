import { Box, CheckBox } from 'grommet'
import { useEffect } from 'react'
import useAuthorization from '../hooks/authorization'
import { Role, User } from '../types/types'

export default function AuthorizationToggle({ user }: { user: User }) {
  const { isAuthorized, grantAuthorization, revokeAuthorization } =
    useAuthorization(user)

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

  function handleKeyboardEvent(event: KeyboardEvent) {
    const element = event.target as HTMLElement
    const shouldTrigger =
      element?.tagName === 'BODY' && event.key === 'A' && event.shiftKey
    if (shouldTrigger) {
      handleChange()
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', handleKeyboardEvent)
    return () => {
      document.removeEventListener('keypress', handleKeyboardEvent)
    }
  })

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
