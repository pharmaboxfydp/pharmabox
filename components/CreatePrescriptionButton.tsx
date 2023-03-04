import { PillsAdd } from '@carbon/icons-react'
import { Box, Button } from 'grommet'
import { useAtom } from 'jotai'
import useAuthorization from '../hooks/authorization'
import { User } from '../types/types'
import { createPrescriptionModalState } from './CreatePrescriptionModal'

export default function CreatePrescriptionButton({ user }: { user: User }) {
  const { isAuthorized } = useAuthorization(user)
  const [, setShowCreatePrescriptionModal] = useAtom(
    createPrescriptionModalState
  )
  return (
    <Box direction="row" align="right">
      <Button
        icon={<PillsAdd size={16} />}
        label="Add New Prescription"
        primary
        fill
        size="medium"
        onClick={() => setShowCreatePrescriptionModal(true)}
        disabled={!isAuthorized}
        data-cy="create-prescription-button"
        style={{ borderRadius: '10px' }}
      />
    </Box>
  )
}
