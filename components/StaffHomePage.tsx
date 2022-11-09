import { ErrorFilled, QID } from '@carbon/icons-react'
import { Box, Card, CardBody, CardHeader, Grid, Tag, Text } from 'grommet'
import { capitalize } from 'lodash'
import Skeleton from 'react-loading-skeleton'
import { useLockerboxes } from '../hooks/lockerbox'
import theme from '../styles/theme'
import { LockerBoxState, User } from '../types/types'
import CardNotification from './CardNotification'

function Loading() {
  return (
    <>
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={8} height={30} style={{ lineHeight: '3' }} />
      </Box>
    </>
  )
}

function Error({ message }: { message: string }) {
  return (
    <>
      <CardNotification>
        <ErrorFilled size={32} color={theme.global.colors['status-error']} />
        <Text textAlign="center">{message}</Text>
      </CardNotification>
    </>
  )
}

function LockerboxesStatus({ user }: { user: User }) {
  const { lockerboxes, isLoading, isError } = useLockerboxes(user)
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return (
      <Error message="Oops! It looks like Pharmabox was not able to load lockerboxes. Try refreshing your page. If the issue persists, contact support." />
    )
  }
  return (
    <Box gap="small" border>
      <Text weight="bold">Locker Status</Text>
      {lockerboxes?.map(
        ({
          label,
          id,
          status
        }: {
          label: number
          id: number
          status: string
        }) => (
          <Card key={label} width="small" pad="small" gap="small">
            <CardHeader>
              <Text size="small" weight="bold">
                Locker Number:{' '}
                <Text size="small" weight="bold">
                  {label}
                </Text>
              </Text>
            </CardHeader>
            <CardBody>
              <Box direction="row" justify="between">
                <Box direction="row">
                  <QID size={24} />
                  <Text>{id}</Text>
                </Box>
                <Box
                  round
                  background={
                    status === LockerBoxState.empty
                      ? theme.global.colors['status-ok']
                      : theme.global.colors['status-warning']
                  }
                  style={{ color: theme.global.colors.white }}
                >
                  <Tag size="xsmall" name="Status" value={capitalize(status)} />
                </Box>
              </Box>
            </CardBody>
          </Card>
        )
      )}
    </Box>
  )
}

export default function StaffHomePage({ user }: { user: User }) {
  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'fulfill', start: [0, 0], end: [0, 0] },
        { name: 'left-pannel', start: [0, 1], end: [0, 1] },
        { name: 'right-pannel', start: [1, 1], end: [1, 1] }
      ]}
    >
      <Box gridArea="fulfill">text</Box>
      <Box gridArea="left-pannel">text</Box>
      <Box gridArea="right-pannel">
        <LockerboxesStatus user={user} />
      </Box>
    </Grid>
  )
}
