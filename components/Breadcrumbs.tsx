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
  key,
  index,
  paths
}: {
  path: string
  label: string
  key: string
  index: number
  paths: { path: string; label: string; key: string }[]
}) {
  if (index !== paths.length - 1) {
    return (
      <Link href={path} key={key}>
        <Box direction="row" gap="xsmall">
          <Text size="small">/</Text>
          <Anchor label={label} size="small" />
        </Box>
      </Link>
    )
  }
  return (
    <div key={key}>
      <Box direction="row" gap="xsmall">
        <Text size="small">/</Text>
        <Text size="small">{label}</Text>
      </Box>
    </div>
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
        <CrumbLink
          path={path}
          label={label}
          key={key}
          index={index}
          paths={paths}
        />
      ))}
    </Box>
  )
}
