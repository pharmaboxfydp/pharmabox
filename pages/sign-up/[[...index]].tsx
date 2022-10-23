import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
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
