import Head from 'next/head'
// import { useClerk, useUser, SignedOut, SignedIn } from '@clerk/nextjs'

// import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../helpers/user-details'
import Page from '../components/Page'
import { ServerPageProps } from '../types/types'
import { Box, Text } from 'grommet'

const CustomHome = ({ user }: ServerPageProps) => {
  if (!user) {
    return (
      <Box pad="medium">
        <Text>User Not Found. Try refreshing your browser</Text>
      </Box>
    )
  }
  return (
    <>
      <Head>
        <title>PharmaBox</title>
        <meta
          name="description"
          content="Pharmabox Homepage. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
        <Box pad="medium">
          <Text>Hello {user?.id}</Text>
          <Text>You are a {user?.role}</Text>
          <Text>Your Email is: {user?.email}</Text>
        </Box>
      </Page>
    </>
  )
}

// export default Home

// export const getServerSideProps = withServerSideAuth(
//   async ({ req, res }) => SSRUser({ req, res }),
//   { loadUser: true }
// )
import { useClerk, useUser, SignedOut, SignedIn } from '@clerk/nextjs'
import React from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import UserSignIn from '../components/UserSignIn'

const Home: NextPage = () => {
  return (
    <>
      <SignedOut>
        {/* <SignedOutCards /> */}
        <UserSignIn />
      </SignedOut>
      <SignedIn>
        <SignedInCards />
      </SignedIn>
    </>
  )
}

const SignedInCards = () => {
  const { user } = useUser()

  return (
    // <>
    //   <a className={styles.staticCard}>
    //     <h2>Welcome!</h2>
    //     <p>Signed in as: {user?.primaryEmailAddress!.toString()}</p>
    //   </a>
    //   <Link href="/settings/profile">
    //     <a className={styles.card}>
    //       <h2>Go to User Profile &rarr;</h2>
    //       <p>Change your password and more</p>
    //     </a>
    //   </Link>

    // </>
    <div style={{ height: '100vh' }}>
      <Head>
        <title>PharmaBox</title>
        <meta
          name="description"
          content="Pharmabox Homepage. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={user}>
        <Box pad="medium">
          <Text>Hello {user?.id}</Text>
          <Text>You are a {user?.role}</Text>
          <Text>Your Email is: {user?.email}</Text>
        </Box>
      </Page>
    </div>
  )
}

export default Home
