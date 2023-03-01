import { QID } from '@carbon/icons-react'
import { Box, Card, CardBody, CardHeader, Tag, Text } from 'grommet'
import { capitalize } from 'lodash'
import { useLockerboxes } from '../hooks/lockerbox'
import theme from '../styles/theme'
import { LockerBoxState, User } from '../types/types'
import { Error } from './Error'
import { Loading } from './Loading'

export function LockerboxesStatus({ user }: { user: User }) {
  const { lockerboxes, isLoading, isError } = useLockerboxes(user)
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return (
      <Error message="Oops! It looks like Pharmabox was not able to load lockerboxes. Try refreshing your page. If the issue persists, contact support." />
    )
  }
  const numBoxes = lockerboxes?.length ?? 1
  const numAvailable = lockerboxes?.filter(
    (box) => box.status === LockerBoxState.empty
  ).length
  const numFull =
    lockerboxes?.filter((box) => box.status === LockerBoxState.full).length ?? 0
  return (
    <Box gap="small" round="small" border pad="medium" overflow="auto" fill>
      <Box direction="row" gap="small">
        <Box width="medium">
          <Text weight="bold">
            Locker Status: {numAvailable}/{numBoxes} Free
          </Text>
        </Box>
        <Box
          width="100%"
          background={theme.global.colors['status-ok']}
          round
          style={{ marginTop: '4px' }}
        >
          <Box
            background={theme.global.colors['status-warning']}
            width={`${(numFull / numBoxes) * 100}%`}
            fill="vertical"
            style={{ display: numFull > 0 ? 'flex' : 'none' }}
            round
            border
            height="small"
          ></Box>
        </Box>
      </Box>
      <Box overflow={{ vertical: 'scroll' }} pad="small">
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
            <Box
              key={label}
              height={{ min: '96px' }}
              data-cy="locker-box-status"
            >
              <Card pad="small" gap="small">
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
                      <Tag
                        size="xsmall"
                        name="Status"
                        value={capitalize(status)}
                      />
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          )
        )}
      </Box>
    </Box>
  )
}
