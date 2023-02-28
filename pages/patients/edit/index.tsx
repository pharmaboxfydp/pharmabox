import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../../helpers/user-details'

import { useRouter } from 'next/router'

const Redirect = () => {
  const router = useRouter()
  router.push('/patients')
  return null
}

export default Redirect

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({
      req,
      res,
      query: { include: { Staff: true, Pharmacist: true } }
    }),
  { loadUser: true }
)
