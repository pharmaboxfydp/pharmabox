import { Box, CheckBox, Text, DateInput } from 'grommet'
import { User } from '../types/types'
export default function PatientSettings({ user }: { user: User }) {
  return (
    <>
      <Box gap="medium" pad="small">
        <Text>Pickup Status</Text>
        <CheckBox
          toggle
          label="Prescription Pickup"
          a11yTitle="Enable Pharmabox Presciption Pickup"
        />
      </Box>
      <Box gap="medium" pad="small">
        <Text>Date Of Birth</Text>
        <Box width="medium">
          <DateInput format="mm/dd/yyyy" />
        </Box>
      </Box>
    </>
  )
}
