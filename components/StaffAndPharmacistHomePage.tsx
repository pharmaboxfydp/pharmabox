import {
  CurrencyDollar,
  ErrorFilled,
  Medication,
  Pen,
  Person,
  QID,
  User as UserIcon,
  Box as BoxIcon
} from '@carbon/icons-react'
import { LockerBox, Patient } from '@prisma/client'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormField,
  Grid,
  Select,
  Tag,
  Text,
  TextInput
} from 'grommet'
import { capitalize } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import useAuthorization from '../hooks/authorization'
import { useLockerboxes } from '../hooks/lockerbox'
import usePatients from '../hooks/patients'
import {
  useLocationPrescriptions,
  usePrescriptions
} from '../hooks/prescriptions'
import theme from '../styles/theme'
import { LockerBoxState, Role, Status, User } from '../types/types'
import CardNotification from './CardNotification'
import { Loading } from './Loading'
import { LocationPrescriptionStatus } from './LocationPrescriptionStatus'
import { LockerboxesStatus } from './LockerBoxStatus'

export default function StaffAndPharmacistHomePage({ user }: { user: User }) {
  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      gap="small"
      areas={[
        { name: 'left-pannel', start: [0, 1], end: [0, 1] },
        { name: 'right-pannel', start: [1, 1], end: [1, 1] }
      ]}
    >
      <Box gridArea="left-pannel">
        <LocationPrescriptionStatus user={user} />
      </Box>
      <Box gridArea="right-pannel">
        <LockerboxesStatus user={user} />
      </Box>
    </Grid>
  )
}
