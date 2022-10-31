import Head from 'next/head'
// import { useClerk, useUser, SignedOut, SignedIn } from '@clerk/nextjs'
import { useRouter } from 'next/router'

import { Box, Text } from 'grommet'

import { SignedOut, SignedIn } from '@clerk/nextjs'
import React from 'react'
import { useEffect } from 'react'
import type { NextPage } from 'next'
import UserSignIn from '../components/UserSignIn'
import Lottie from 'lottie-react'
import loadingAnimation from '../public/assets/loading.json'

const Home: NextPage = () => {
  return (
    <div style={{ height: '100vh' }}>
      <SignedOut>
        <UserSignIn />
      </SignedOut>
      <SignedIn>
        <InitialLoadingPage />
      </SignedIn>
    </div>
  )
}

const InitialLoadingPage = () => {
  const router = useRouter()
  useEffect(() => {
    async function wait() {
      await setTimeout(() => router.push('/home'), 100)
    }
    wait()
  }, [router])

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Head>
        <title>PharmaBox</title>
        <meta
          name="description"
          content="Pharmabox Homepage. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Lottie width={200} animationData={loadingAnimation} loop={true} />
    </div>
  )
}
export default Home
