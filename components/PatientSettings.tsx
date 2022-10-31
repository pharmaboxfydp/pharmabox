import {
  Box,
  CheckBox,
  Text,
  DateInput,
  Spinner,
  Tag,
  Notification
} from 'grommet'
import { ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { User } from '../types/types'

export default function PatientSettings({ user }: { user: User }) {
  let pickup
  if (user.Patient) {
    const { pickupEnabled } = user.Patient
    pickup = pickupEnabled
  }
  const [pickupState, setPickupState] = useState<boolean>(pickup ?? false)
  const [fetchingPickup, setFetchingPickup] = useState<boolean>(false)

  async function onPickupChangeSuccess(response: Response, state: boolean) {
    if (response.status === 200) {
      setFetchingPickup(false)
      setPickupState(state)
      toast.success(`Pickup ${state ? 'enabled' : 'turned off'}.`, {
        icon: '👍'
      })
    }
  }

  async function onPickupChangeFailure(response: Response) {
    setFetchingPickup(false)
    toast.error('Unable to update preferences. Please try again', {
      icon: '😥'
    })
  }

  function handlePickupStateChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked: state } = event.target
    setFetchingPickup(true)
    fetch('/api/patients/update/pickup', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          pickupEnabled: state,
          userId: user.id
        }
      })
    })
      .then(async (response) => onPickupChangeSuccess(response, state))
      .catch(async (response) => onPickupChangeFailure(response))
  }

  if (!user.Patient) {
    return null
  }

  return (
    <>
      <Box gap="medium" pad="small">
        <Text>Pickup Status</Text>
        <Box flex="grow" direction="row" gap="medium">
          <CheckBox
            toggle
            label="Prescription Pickup"
            a11yTitle="Enable Pharmabox Presciption Pickup"
            checked={pickupState}
            onChange={handlePickupStateChange}
          />
          <Box>
            {fetchingPickup && (
              <Box pad="xsmall">
                <Spinner />
              </Box>
            )}
            {!fetchingPickup && (
              <Notification
                message={
                  <Text size="small">
                    {pickupState ? 'Active' : 'Inactive'}
                  </Text>
                }
                status={pickupState ? 'normal' : 'warning'}
              />
            )}
          </Box>
        </Box>
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
