# API Documentation

As is the case with `Next.js` applications, the API endpoints are listed in `/pages/api/` Any endpoint that you create will have the following URLS:

- local development: `http://localhost:3000/api/your/api/path`
- production: `https://pharmabox.vercel.app/api/your/api/path`

For detailed information about how to construct API endpoints with `Next.js` refer to [framework's documentation](https://nextjs.org/docs/api-routes/introduction). The documentation includes helpful information addressing [Dynamic Routes](https://nextjs.org/docs/api-routes/dynamic-api-routes), [Request Helpers](https://nextjs.org/docs/api-routes/request-helpers), and [Response Helpers](https://nextjs.org/docs/api-routes/response-helpers). It is recommended to review the documentation before creating a new endpoint so that the convention is followed. We also use `SWR` to maintain our react hooks. It is recommended that you review the [SWR Documentation](https://swr.vercel.app/docs/getting-started) prior to the creation, or modification of a hook.

## Calling an API on the Frontend

API calls from the frontend should take place from within a [React Hook](https://reactjs.org/docs/hooks-intro.html) with [SWR](https://swr.vercel.app/docs/getting-started). You should avoid making API calls via a `useEffect` hook, as this is not necessary in most cases, and is considered an anti-pattern in `Next.js` when fetching data. All hooks should be created in the [`/hooks/`](./hooks/) Directory. You can refer to the [role hook](./hooks/role.ts) as a simple example of calling an API endpoint via the fronted using a hook.

### Example

```ts
// ./hooks/role.ts
// Updated: Jan-20-2023

import { Staff } from '@prisma/client'
import { toast } from 'react-toastify'
import { useSWRConfig } from 'swr'
import { Permissions } from '../types/types'

export default function useRole() {
  const { mutate } = useSWRConfig()

  async function updateRole({
    value,
    member
  }: {
    value: string
    member: Staff
  }) {
    const response = await fetch('/api/staff/update/permissions', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          userId: member.userId,
          isAdmin: value === Permissions.Admin ? true : false
        }
      })
    })
    if (response.status === 200) {
      await response.json()
      toast.success(`Updated to ${value}`, { icon: '👍' })
      mutate('/api/team')
    } else {
      toast.error('Unable to update role', { icon: '😥' })
    }
  }
  return {
    updateRole
  }
}
```

The Hook can be used as follows:

```tsx
import useRole from '../hooks/role'

function MyComponent() {
  const { updateRole } = useRole()
  return <button onClick={updateRole}></button>
}
```

## Calling an API on the Backend

Calling API endpoints from the backend or in a script is much simpler. It is recommended that you use the `node-fetch` library to make calls the to API. See the following example taken from [`./lib/scripts/team.ts`](./lib/scripts/team.ts).

```ts
// ./lib/scripts/team.ts
// Updated: Jan-20-2023

import fetch from 'node-fetch'

const BASE_URL =
  environment === 'dev'
    ? 'http://localhost:3000/api'
    : 'https://pharmabox.vercel.app/api'

async function addStaffToLocation({ userId, locationId }: AddStaffPayload) {
  const response = await fetch(`${BASE_URL}/team/members/add`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        userId,
        locationId
      }
    })
  })
  const res = await response.json()
  return res
}
```

## General API Usage

### GET - Requests

Generally speaking, `GET` requests are used to fetch data and follow a nesting pattern. There is no body associated with a get request so your target must be specified via the request URL. That means that your request defines the layer of specificity. For example

- `GET /api/patients/` Gets **All** Patients and is given by the file path `/pages/api/patients/index.ts`
- `GET /api/patients/1asfg153` Gets the Patient with `id` of `1asfg153` and is given by the file path `/pages/api/patients/[id].ts`
