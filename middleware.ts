import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req)
  // if (!userId) {
  //   const signInUrl = new URL('/sign-in', req.url)
  //   signInUrl.searchParams.set('redirect_url', req.url)
  //   return NextResponse.redirect(signInUrl)
  // }
  return NextResponse.next()
})

export const config = {
  matcher: ['/api/patients/:path*', '/api/prescriptions/:path*']
}
