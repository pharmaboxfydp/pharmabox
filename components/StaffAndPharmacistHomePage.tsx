import { Box, Grid } from 'grommet'

import { User } from '../types/types'
import CreatePrescriptionButton from './CreatePrescriptionButton'
import { LocationPrescriptionStatus } from './LocationPrescriptionStatus'
import { LockerboxesStatus } from './LockerBoxStatus'

export default function StaffAndPharmacistHomePage({ user }: { user: User }) {
  return (
    <Box>
      <Grid
        rows={['auto', 'flex']}
        columns={['auto', 'flex']}
        gap="small"
        areas={[
          { name: 'fulfill', start: [0, 0], end: [1, 1] },
          { name: 'left-pannel', start: [0, 1], end: [0, 1] },
          { name: 'right-pannel', start: [1, 1], end: [1, 1] }
        ]}
      >
        <Box gridArea="fulfill" fill>
          <CreatePrescriptionButton user={user} />
        </Box>
        <Box gridArea="left-pannel">
          <LocationPrescriptionStatus user={user} />
        </Box>
        <Box gridArea="right-pannel">
          <LockerboxesStatus user={user} />
        </Box>
      </Grid>
    </Box>
  )
}
