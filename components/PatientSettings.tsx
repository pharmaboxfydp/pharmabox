import {
  Box,
  CheckBox,
  Text,
  DateInput,
  Spinner,
  Notification,
  Tip
} from 'grommet'
import { ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { User } from '../types/types'
import { debounce } from 'ts-debounce'
import { Help } from '@carbon/icons-react'

export default function PatientSettings({ user }: { user: User }) {
  let pickup: boolean = false
  let birthdate: null | string = null
  if (user.Patient) {
    const { pickupEnabled } = user.Patient
    pickup = pickupEnabled
  }
  const [pickupState, setPickupState] = useState<boolean>(pickup ?? false)
  const [fetchingPickup, setFetchingPickup] = useState<boolean>(false)

  const [birthdateState, setBirthdate] = useState<string | string[] | null>(
    birthdate
  )
  const [fetchingBirthdate, setFetchingBirthdate] = useState<boolean>(false)

  const [dismissWarning, setDismissWarning] = useState<boolean>(false)

  async function onPickupChangeSuccess(response: Response, state: boolean) {
    if (response.status === 200) {
      setFetchingPickup(false)
      setPickupState(state)
      toast.success(`Pickup ${state ? 'enabled' : 'turned off'}.`, {
        icon: '👍'
      })
    }
  }

  async function onPickupChangeFailure() {
    setFetchingPickup(false)
    toast.error('Unable to update preferences. Please try again', {
      icon: '😥'
    })
  }

  async function onBirthdateChangeSuccess(
    response: Response,
    state: string | string[]
  ) {
    if (response.status === 200) {
      setFetchingBirthdate(false)
      setBirthdate(state)
      toast.success(`Birthdate Updated`, {
        icon: '👍'
      })
    }
  }

  async function onBirthdateChangeFailure() {
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
      .catch(async () => onPickupChangeFailure())
  }

  function handleBirthdateStateChange(event: { value: string | string[] }) {
    const { value: dob } = event

    if (typeof dob !== 'string') {
      return false
    }

    const currentDate = Date.now()
    const attemptedDate = new Date(dob as string).getTime()

    if (attemptedDate >= currentDate) {
      return false
    }

    setFetchingBirthdate(true)
    fetch('/api/patients/update/dob', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          dob,
          userId: user.id
        }
      })
    })
      .then((response) => onBirthdateChangeSuccess(response, dob))
      .catch(() => onBirthdateChangeFailure())
  }

  const debounceBirthdateStateChange = debounce(
    handleBirthdateStateChange,
    1000
  )

  if (!user.Patient) {
    return null
  }

  return (
    <>
      <Box gap="medium" pad="small">
        {!birthdateState && !dismissWarning && (
          <Box animation="fadeIn">
            <Notification
              status="critical"
              onClose={() => setDismissWarning(true)}
              message={
                <Box pad="xxsmall" gap="xsmall" direction="row">
                  <Text size="small">
                    You must provide your birthdate before you can begin using
                    Pharmabox
                  </Text>
                  <Tip
                    content={
                      <Text size="small">
                        Pharmabox requires your date of birth to help confirm
                        your identity at the pharmacy
                      </Text>
                    }
                  >
                    <Help size={20} />
                  </Tip>
                </Box>
              }
            />
          </Box>
        )}
        <Text>Pickup Status</Text>
        <Box flex="grow" direction="row" gap="medium" animation="fadeIn">
          <CheckBox
            toggle
            label="Prescription Pickup"
            a11yTitle="Enable Pharmabox Presciption Pickup"
            checked={pickupState}
            onChange={handlePickupStateChange}
            disabled={!birthdateState}
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
                    {pickupState && birthdateState ? 'Active' : 'Inactive'}
                  </Text>
                }
                status={pickupState && birthdateState ? 'normal' : 'warning'}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box gap="medium" pad="small">
        <Text>Date Of Birth</Text>
        <Box flex="grow" direction="row" gap="medium">
          <Box width="small">
            <DateInput
              size="small"
              format="mm/dd/yyyy"
              defaultValue={birthdateState ?? undefined}
              onChange={debounceBirthdateStateChange}
              className="date-input"
              buttonProps={{ size: 'small' }}
              calendarProps={{ size: 'small' }}
            />
          </Box>
          <Box pad="xsmall">{fetchingBirthdate && <Spinner />}</Box>
        </Box>
      </Box>
    </>
  )
}
