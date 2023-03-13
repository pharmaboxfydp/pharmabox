import {
  Alarm,
  Medication,
  Person,
  ShoppingBag,
  TrashCan
} from '@carbon/icons-react'
import { LockerBox } from '@prisma/client'
import {
  Card,
  CardHeader,
  Box,
  Text,
  CardBody,
  Anchor,
  CardFooter,
  Button
} from 'grommet'
import ReactTimeAgo from 'react-time-ago'
import { formatPhoneNumber } from '../helpers/validators'
import theme from '../styles/theme'
import {
  PatientWithUser,
  PharmacistWithUser,
  StaffWithUser
} from '../types/types'

export interface PrevPrescriptionCard {
  id: number
  name: string
  createdTime: Date
  LockerBox: LockerBox
  Patient: PatientWithUser
  Staff: StaffWithUser
  Pharmacist: PharmacistWithUser
}

export default function PrevPrescriptionsCard({
  id,
  name,
  createdTime,
  LockerBox: { label },
  Patient,
  Staff,
  Pharmacist: { User: PharmUser }
}: PrevPrescriptionCard) {
  return (
    <Card pad="small" gap="small" key={label} border>
      <CardHeader>
        <Box direction="row" gap="medium">
          <Medication size={24} color={theme.global.colors['neutral-3']} />
          <Text size="small" weight="bold">
            {name}
          </Text>
          <Text size="small">Box: {label}</Text>
        </Box>
      </CardHeader>
      <CardBody gap="small">
        <Box direction="row" gap="medium">
          <Text size="small">
            Created:{' '}
            <ReactTimeAgo date={new Date(createdTime as Date)} locale="en-US" />
          </Text>
          <Text size="small">
            Pharm: {`${PharmUser.firstName?.charAt(0)} ${PharmUser.lastName}`}
          </Text>
          {Staff && (
            <Text size="small">
              Staff:{' '}
              {`${Staff?.User.firstName?.charAt(0)} ${Staff?.User?.lastName}`}
            </Text>
          )}
        </Box>
        <Text size="small" weight="bold">
          Patient Information
        </Text>
        <Box direction="row" gap="small" flex>
          <Person size={20} />
          <Anchor size="small" href={`/patients/${Patient.id}`}>
            {Patient.id}
          </Anchor>
          <Box direction="row" gap="xsmall">
            <Text size="small">{Patient.User.firstName}</Text>
            <Text size="small">{Patient.User.lastName}</Text>
          </Box>
          <Text size="small">
            {formatPhoneNumber(`${Patient.User.phoneNumber}`)}
          </Text>
        </Box>
      </CardBody>
    </Card>
  )
}
