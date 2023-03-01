import { ErrorFilled } from '@carbon/icons-react'
import { Text } from 'grommet'
import theme from '../styles/theme'
import CardNotification from './CardNotification'

export function Error({ message }: { message: string }) {
  return (
    <>
      <CardNotification>
        <ErrorFilled size={32} color={theme.global.colors['status-error']} />
        <Text textAlign="center">{message}</Text>
      </CardNotification>
    </>
  )
}
