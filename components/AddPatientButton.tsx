import { Add } from '@carbon/icons-react'
import { Box, Button } from 'grommet'
import { useAtom } from 'jotai'
import useAuthorization from '../hooks/authorization'
import { User } from '../types/types'
import { addPatientModalState } from './AddPatientModal'

export default function AddPatientButton({ user }: { user: User }) {
  const { isAuthorized } = useAuthorization(user)
  const [, setShowAddPatientModal] = useAtom(addPatientModalState)

  return (
    <Box direction="row" align="right">
      <Button
        icon={<Add size={16} />}
        label="Add Patient"
        primary
        size="small"
        onClick={() => setShowAddPatientModal(true)}
        disabled={!isAuthorized}
      />
    </Box>
  )
}
