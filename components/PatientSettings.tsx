import { Box, CheckBox, Text, DateInput } from 'grommet'
import { ChangeEvent, useState } from 'react'
import { User } from '../types/types'
export default function PatientSettings({ user }: { user: User }) {
  let pickup, dOB
  if (user.Patient) {
    const { pickupEnabled, dob } = user.Patient
    pickup = pickupEnabled
    dOB = dob
  }
  const [pickupState, setPickupState] = useState<boolean>(pickup ?? false)
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(dOB ?? null)

  function handlePickupStateChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked: state } = event.target
    setPickupState(state)
  }

  return (
    <>
      <Box gap="medium" pad="small">
        <Text>Pickup Status</Text>
        <CheckBox
          toggle
          label="Prescription Pickup"
          a11yTitle="Enable Pharmabox Presciption Pickup"
          checked={pickupState}
          onChange={handlePickupStateChange}
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
