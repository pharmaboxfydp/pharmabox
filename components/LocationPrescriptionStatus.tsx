import { Box, Text } from 'grommet'
import {
  useLocationPrescriptions,
  usePrescriptions
} from '../hooks/prescriptions'
import { User } from '../types/types'
import ActivePrescriptionsCard from './ActivePrescriptionsCard'
import { Error } from './Error'
import { Loading } from './Loading'

export function LocationPrescriptionStatus({ user }: { user: User }) {
  const { activePrescriptions, isLoading, isError } =
    useLocationPrescriptions(user)
  const { sendPickupReminder, deletePrescription, markPrescriptionPickedUp } =
    usePrescriptions({
      user: user
    })
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return (
      <Error message="Oops! It looks like Pharmabox was not able to load prescriptions. Try refreshing your page. If the issue persists, contact support." />
    )
  }
  return (
    <Box gap="small" border pad="medium" round="small" overflow="auto" fill>
      <Text weight="bold">Prescriptions Awaiting Pickup</Text>
      <Box overflow={{ vertical: 'scroll' }} pad="xsmall" gap="medium">
        {activePrescriptions?.map(
          ({
            id,
            name,
            createdTime,
            LockerBox,
            Patient,
            Staff,
            Pharmacist
          }) => (
            <div key={LockerBox.label}>
              <ActivePrescriptionsCard
                id={id}
                name={name}
                createdTime={createdTime as Date}
                Patient={Patient}
                Staff={Staff}
                LockerBox={LockerBox}
                Pharmacist={Pharmacist}
                deletePrescription={deletePrescription}
                sendPickupReminder={sendPickupReminder}
                markPrescriptionPickedUp={markPrescriptionPickedUp}
              />
            </div>
          )
        )}
      </Box>
    </Box>
  )
}
