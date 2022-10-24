import { Box, Card, Text } from 'grommet'
import { PropsWithChildren } from 'react'
import { PatientRootPages, Role, StaffRootPages } from '../types/types'
import { useRouter } from 'next/router'
import { WarningAlt } from '@carbon/icons-react'
import theme from '../styles/theme'

export default function Protector({
  children,
  role = Role.Patient
}: PropsWithChildren<{ role?: Role }>) {
  const router = useRouter()
  const patientPages = Object.values(PatientRootPages)
  const staffPages = Object.values(StaffRootPages)

  const isValidPatient =
    role === Role.Patient &&
    patientPages.includes(router.pathname as PatientRootPages)
  const isValidStaff =
    role === Role.Staff &&
    staffPages.includes(router.pathname as StaffRootPages)
  if (isValidStaff || isValidPatient) {
    return <Box>{children}</Box>
  } else {
    return (
      <Box
        pad="medium"
        direction="row"
        flex="grow"
        gap="medium"
        align="center"
        justify="center"
      >
        <Card align="center" gap="medium" pad="large">
          <WarningAlt size={32} color={theme.global.colors['status-error']} />
          <Text size="large">Unauthorized</Text>
        </Card>
      </Box>
    )
  }
}
