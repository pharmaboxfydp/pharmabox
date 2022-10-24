import { Box, Button } from 'grommet'
import Link from 'next/link'
import { ReactElement } from 'react'

export interface SidebarButtonInterface {
  icon?: ReactElement
  label: string
  href: string
  rest?: Record<string, any>
}

export default function SidebarButton({
  icon,
  label,
  href,
  ...rest
}: SidebarButtonInterface) {
  return (
    <Box pad="small">
      <Link href={href} passHref>
        <Button
          gap="medium"
          alignSelf="start"
          plain
          icon={icon}
          label={label}
          {...rest}
        />
      </Link>
    </Box>
  )
}
