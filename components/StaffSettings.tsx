import { Text } from 'grommet'
import { User } from '../types/types'

export default function StaffSettings({ user }: { user: User }) {
  return <Text>Staff Settings for {user.firstName}</Text>
}
