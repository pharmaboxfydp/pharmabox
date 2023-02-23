import { Box, Button } from 'grommet'
import Link from 'next/link'
import { ReactElement } from 'react'
import theme from '../styles/theme'

export interface SidebarButtonInterface {
  icon?: ReactElement
  label: string
  href?: string
  rest?: Record<string, any>
  onClick?: () => void
}

export default function SidebarButton({
  icon,
  label,
  href = '/',
  ...rest
}: SidebarButtonInterface) {
  return (
    <Box pad="xsmall">
      <Link href={href} passHref>
        <Button
          justify="start"
          icon={icon}
          label={label}
          {...rest}
          a11yTitle={label}
          hoverIndicator
          color={theme.global.colors['neutral-2']}
          size="small"
          style={{ borderRadius: '4px' }}
          data-cy={label}
        />
      </Link>
    </Box>
  )
}
