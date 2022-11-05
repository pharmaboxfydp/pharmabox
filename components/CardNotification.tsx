import { Box, Card } from 'grommet'
import { PropsWithChildren } from 'react'

export default function CardNotification(props: PropsWithChildren) {
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
        {props.children}
      </Card>
    </Box>
  )
}
