import Head from 'next/head'
import { Anchor, Box, Header, Text } from 'grommet'
import Lottie from 'lottie-react'
import dinoAnimation from '../public/assets/dino.json'
import { ServerPageProps } from '../types/types'

const FourOFour = ({ user }: ServerPageProps) => {
  return (
    <>
      <Head>
        <title>PharmaBox | Not Found</title>
        <meta name="description" content="Not Found" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        animation="fadeIn"
        direction="column"
        align="start"
        fill
        className="logbook"
      >
        <Box direction="row" border="top" fill>
          <Box
            pad="medium"
            basis="auto"
            fill="horizontal"
            gap="medium"
            align="center"
          >
            <Header align="center">
              <Text>
                The page you are looking for does not exist.{' '}
                <Anchor href="/home" label="Return Home" aria-label="Home">
                  Return Home.
                </Anchor>
              </Text>
            </Header>
            <Box pad="large">
              <Lottie
                animationData={dinoAnimation}
                style={{ height: '100%' }}
                autoPlay
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default FourOFour
