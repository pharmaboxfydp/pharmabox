import { withClerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default withClerkMiddleware(() => {
  /* const { userId } = getAuth(req)
  if (!userId) {
    debugger
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  } */
  return NextResponse.next()
})

// Stop Middleware running on static files like images
export const config = { matcher: ['/api/:path*', '/((?!.*\\.).*)'] }
