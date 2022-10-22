import { SignUp } from '@clerk/nextjs'
import { useEffect } from 'react'

const SignUpPage = () => {
  useEffect(() => {
    console.log('rendered')
  }, [])
  return (
    <div>
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/"
      />
    </div>
  )
}

export default SignUpPage
