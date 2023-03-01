import { Close } from '@carbon/icons-react'
import { Box, Button, Layer, Text } from 'grommet'
import theme from '../styles/theme'

export default function DeletePatientModal({
  onClose,
  onSubmit,
  patientFullName
}: {
  onClose: () => void
  onSubmit: () => void
  patientFullName: string
}) {
  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box pad="medium">
        <>
          <Box flex={false} direction="row" justify="between">
            <Box pad="small">
              <Text size="medium" weight="bold">
                Delete Patient
              </Text>
            </Box>
            <Button icon={<Close size={16} />} onClick={onClose} />
          </Box>
          <Box pad="small" gap="medium">
            <Text size="small">
              Delete <b>{patientFullName}</b> from PharmaBox? This action cannot
              be undone.
            </Text>
            <Box flex={false} direction="row" justify="between" gap="medium">
              <Button label="Cancel" size="small" onClick={onClose} />
              <Button
                label={`Remove ${patientFullName}`}
                primary
                size="small"
                color={theme.global.colors['status-critical']}
                onClick={onSubmit}
              />
            </Box>
          </Box>
        </>
      </Box>
    </Layer>
  )
}
