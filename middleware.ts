import { withClerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'

export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req)
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next()
})

// Stop Middleware running on static files like images
export const config = { matcher: ['/api/:path*', '/((?!.*\\.).*)'] }
