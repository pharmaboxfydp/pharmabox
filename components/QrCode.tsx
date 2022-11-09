import theme from '../styles/theme'
import { Box, Button, Layer, Text } from 'grommet'
import QRCode from 'react-qr-code'

const QRCodeModal = ({
  qrCode,
  onClose,
  lockerBox
}: {
  qrCode: string
  onClose: any
  lockerBox: number | null
}) => {
  return (
    <Layer position="center" onClickOutside={onClose} onEsc={onClose}>
      <Box pad="medium" gap="medium" animation="fadeIn" overflow="scroll">
        <Text weight="bolder">Scan QR Code</Text>
        <Text>
          Scan the QR Code below at the Pharmabox.{' '}
          {lockerBox && (
            <>
              Then retreive your prescription from{' '}
              <Text weight="bold">Locker {lockerBox}</Text>
            </>
          )}
        </Text>
        <Box align="center">
          <QRCode value={qrCode} />
        </Box>
        <Button
          label="Close"
          onClick={onClose}
          style={{
            background: theme.global.colors['status-critical'],
            borderRadius: '4px',
            color: theme.global.colors.white
          }}
          size="small"
        />
      </Box>
    </Layer>
  )
}

export default QRCodeModal
