import { Anchor, Box, Text } from 'grommet'
import Link from 'next/link'
import { useRouter } from 'next/router'

function getPaths(currentPath: string): string[] {
  const splitPaths = currentPath.split('/').filter((path) => path !== '')
  return splitPaths.map((path, index, paths) => {
    if (index === 0) {
      return `/${path}`
    }
    const prevPath: string = paths.slice(0, index).join('/')
    return `/${prevPath}/${path}/`
  })
}

function CrumbLink({
  path,
  label,
  index,
  paths
}: {
  path: string
  label: string
  index: number
  paths: { path: string; label: string; key: string }[]
}) {
  if (index !== paths.length - 1) {
    return (
      <Link href={path}>
        <Box direction="row" gap="xsmall">
          {index !== 0 && <Text size="medium">/</Text>}
          <Anchor label={label} size="medium" weight="light" />
        </Box>
      </Link>
    )
  }
  return (
    <Box direction="row" gap="xsmall">
      {index !== 0 && <Text size="medium">/</Text>}
      <Text size="medium">{label}</Text>
    </Box>
  )
}

export default function Breadcrumbs({ pages }: { pages: string[] }) {
  const router = useRouter()
  const paths = getPaths(router.asPath).map((path, index) => ({
    label: pages[index],
    path,
    key: pages[index]
  }))
  return (
    <Box direction="row" gap="small" pad="medium">
      {paths.map(({ path, label, key }, index, paths) => (
        <div key={key}>
          <CrumbLink path={path} label={label} index={index} paths={paths} />
        </div>
      ))}
    </Box>
  )
}
