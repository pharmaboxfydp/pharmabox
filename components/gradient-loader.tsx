import { Box, Text, Spinner } from 'grommet'
import { EdgeSizeType } from 'grommet/utils'
export default function GradientLoader({
  size = 'xlarge'
}: {
  size?: EdgeSizeType
}) {
  return (
    <Box
      align="center"
      pad="large"
      animation={{ type: 'zoomIn', duration: 1000 }}
    >
      <Text size="2xl">Loading</Text>
      <Box pad="medium">
        <Spinner
          size={size}
          round="full"
          border={false}
          background="linear-gradient(to right, #fc466b, #3B42F0)"
        />
      </Box>
    </Box>
  )
}
