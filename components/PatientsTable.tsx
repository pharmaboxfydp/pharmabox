import {
  DataTable,
  Text,
  Box,
  Select,
  Button,
  Layer,
  Spinner,
  Tip
} from 'grommet'
import useTeam from '../hooks/team'
import { Permissions, User } from '../types/types'
import Skeleton from 'react-loading-skeleton'
import { Close, ErrorFilled } from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import { toast } from 'react-toastify'
import usePatients from '../hooks/patients'
import { useRouter } from 'next/router'

export default function PatientsTable() {
  const router = useRouter()
  const { isLoading, isError, patients } = usePatients(router.query)
  console.log(patients)

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
          Oops! It looks like Pharmabox was not able to load your team. Try
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
          columns={[]}
          step={10}
          paginate
          resizeable
          data={patients ?? []}
        />
      </Box>
    </>
  )
}
