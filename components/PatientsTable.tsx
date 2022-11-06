import {
  DataTable,
  Text,
  Box,
  Select,
  Button,
  Layer,
  Spinner,
  Tip,
  Tag
} from 'grommet'

import Skeleton from 'react-loading-skeleton'
import { ErrorFilled } from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import { toast } from 'react-toastify'
import usePatients from '../hooks/patients'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

export default function PatientsTable() {
  const step = 5
  const router = useRouter()
  const query = isEmpty(router.query)
    ? { take: `${step}`, page: '1' }
    : router.query
  const { isLoading, isError, patients } = usePatients(query)

  if (isLoading && !isError) {
    return (
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={5} height={30} style={{ lineHeight: '3' }} />
      </Box>
    )
  }

  if (isError) {
    return (
      <CardNotification>
        <ErrorFilled size={32} color={theme.global.colors['status-error']} />
        <Text textAlign="center">
          Oops! It looks like Pharmabox was not able to load patients. Try
          refreshing your page. If the issue persists, contact your system
          administrator.
        </Text>
      </CardNotification>
    )
  }

  return (
    <>
      <Box>
        <DataTable
          sortable
          columns={[
            {
              property: 'First Name',
              header: <Text size="small">First Name</Text>,
              render: ({ User }) => <Text size="small">{User.firstName}</Text>
            },
            {
              property: 'Family Name',
              header: <Text size="small">Last Name</Text>,
              render: ({ User }) => <Text size="small">{User.lastName}</Text>
            },
            {
              property: 'Date of Birth',
              header: <Text size="small">Date of Birth</Text>,
              render: ({ dob }) => (
                <>
                  {dob ? (
                    <Text size="small">{dob}</Text>
                  ) : (
                    <Text
                      size="small"
                      color={theme.global.colors['status-warning']}
                    >
                      -
                    </Text>
                  )}
                </>
              )
            },
            {
              property: 'Contact',
              header: <Text size="small">Contact</Text>,
              render: ({ User: user }) => (
                <Box direction="column">
                  <Text size="small" color={theme.global.colors['dark-2']}>
                    <Text weight="bolder" size="small">
                      Phone:
                    </Text>{' '}
                    {user.phoneNumber ? (
                      user.phoneNumber
                    ) : (
                      <Text
                        size="small"
                        color={theme.global.colors['status-warning']}
                      >
                        -
                      </Text>
                    )}
                  </Text>
                  <Text size="small" color={theme.global.colors['dark-2']}>
                    <Text size="small" weight="bolder">
                      Email:
                    </Text>{' '}
                    {user.email}
                  </Text>
                </Box>
              )
            },
            {
              property: 'Pickup',
              header: <Text size="small">Pickup</Text>,
              render: ({ pickupEnabled }) => (
                <Box
                  round
                  background={
                    pickupEnabled
                      ? theme.global.colors['status-ok']
                      : theme.global.colors['dark-3']
                  }
                  pad="xxsmall"
                  align="center"
                >
                  <Text
                    size="xsmall"
                    color={
                      pickupEnabled
                        ? theme.global.colors.white
                        : theme.global.colors.black
                    }
                  >
                    {pickupEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </Box>
              )
            }
          ]}
          step={10}
          paginate
          resizeable
          data={patients ?? []}
        />
      </Box>
    </>
  )
}
