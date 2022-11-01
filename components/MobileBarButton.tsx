import { Box, Button } from 'grommet'
import Link from 'next/link'
import { ReactElement } from 'react'
import theme from '../styles/theme'

export interface MobileBarButtonInterface {
  icon?: ReactElement
  label: string
  href?: string
  rest?: Record<string, any>
  onClick?: () => void
}

export default function MobileBarButton({
  icon,
  label,
  href = '/',
  ...rest
}: MobileBarButtonInterface) {
  return (
    <Box pad="small">
      <Link href={href} passHref>
        <Button
          justify="start"
          icon={icon}
          {...rest}
          a11yTitle={label}
          hoverIndicator
          color={theme.global.colors['white']}
          size="small"
          style={{ borderRadius: '4px' }}
        />
      </Link>
    </Box>
  )
}
