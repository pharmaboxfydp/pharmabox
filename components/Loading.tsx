import { Box } from 'grommet'
import Skeleton from 'react-loading-skeleton'

export function Loading() {
  return (
    <>
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={8} height={30} style={{ lineHeight: '3' }} />
      </Box>
    </>
  )
}
