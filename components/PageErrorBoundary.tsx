import { WarningAlt } from '@carbon/icons-react'
import { Box, Card, Text } from 'grommet'
import { PropsWithChildren } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import theme from '../styles/theme'

/**
 * Handles a page level error fallback for client-side errors
 * @param FallbackProps
 * @returns
 */
function ErrorFallback({ error }: FallbackProps) {
  return (
    <Box
      pad="medium"
      direction="row"
      flex="grow"
      gap="medium"
      align="center"
      justify="center"
    >
      <Card align="center" gap="medium" pad="large">
        <WarningAlt size={32} color={theme.global.colors['status-error']} />
        <Text size="large">Pharmabox Encountered an Error</Text>
        <Card border gap="medium" pad="medium">
          <Text>Message</Text>
          <Text>{error.message}</Text>
          <Text>Stack</Text>
          <Text>{error.stack}</Text>
        </Card>
      </Card>
    </Box>
  )
}

export default function PageErrorBoundary(props: PropsWithChildren) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {props.children}
    </ErrorBoundary>
  )
}
