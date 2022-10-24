import { Sidebar as GSidebar, Nav } from 'grommet'
import theme from '../styles/theme'
import { PatientRootPages, Role, StaffRootPages } from '../types/types'
import SidebarButton from './SidebarButton'

export const allowedUrls: Record<
  Role,
  Array<{ link: StaffRootPages | PatientRootPages; name: string }>
> = {
  PATIENT: [
    { link: PatientRootPages.Home, name: 'Home' },
    { link: PatientRootPages.Payments, name: 'Payments' },
    { link: PatientRootPages.Notifications, name: 'Notifications' },
    { link: PatientRootPages.Settings, name: 'Settings' }
  ],
  STAFF: [
    { link: StaffRootPages.Home, name: 'Home' },
    { link: StaffRootPages.Patients, name: 'Patients' },
    { link: StaffRootPages.Workflows, name: 'Workflows' },
    { link: StaffRootPages.Team, name: 'Team' },
    { link: StaffRootPages.Logbook, name: 'Logbook' },
    { link: PatientRootPages.Settings, name: 'Settings' }
  ]
}

export default function Sidebar({ role }: { role?: Role }) {
  /**
   * If no role is provided default to patient
   */
  const urls = allowedUrls[role ?? 'PATIENT']
  return (
    <GSidebar background={theme.global.colors['dark-1']} height="100%">
      <Nav>
        {urls.map(
          ({ link, name }) =>
            name !== 'Settings' && (
              <SidebarButton href={link} key={link} label={name} />
            )
        )}
      </Nav>
    </GSidebar>
  )
}
