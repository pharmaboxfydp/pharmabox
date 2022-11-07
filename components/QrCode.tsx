import Head from 'next/head'
import theme from '../styles/theme'
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Layer
} from 'grommet'
import QRCode from 'react-qr-code'

const QRCodeModal = ({ qrCode, onClose }: { qrCode: string; onClose: any }) => {
  return (
    <Layer
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
      margin="large"
    >
      <Box pad={'xlarge'}>
        <Card
          pad="medium"
          margin="medium"
          justify="center"
          align="center"
          gap="medium"
          background={theme.global.colors['light-1']}
        >
          <CardHeader>
            <h2>Scan To Unlock</h2>
          </CardHeader>
          <CardBody style={{ minHeight: 256, minWidth: 256 }}>
            <QRCode value={qrCode} />
          </CardBody>
          <CardFooter>
            <Button
              label="Close"
              margin={'large'}
              onClick={onClose}
              style={{
                background: theme.global.colors['status-critical'],
                borderRadius: '4px'
              }}
              size="large"
            />
          </CardFooter>
        </Card>
      </Box>
    </Layer>
  )
}

export default QRCodeModal
