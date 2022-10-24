import { Sidebar as GSidebar, Nav } from 'grommet'
import { PatientRootPages, Role, StaffRootPages } from '../types/types'
import SidebarButton from './SidebarButton'

export const allowedUrls: Record<
  Role,
  Array<StaffRootPages | PatientRootPages>
> = {
  PATIENT: [
    PatientRootPages.Home,
    PatientRootPages.Payments,
    PatientRootPages.Notifications,
    PatientRootPages.Settings
  ],
  STAFF: [
    StaffRootPages.Home,
    StaffRootPages.Patients,
    StaffRootPages.Workflows,
    StaffRootPages.Team,
    StaffRootPages.Logbook,
    PatientRootPages.Settings
  ]
}

export default function Sidebar({ role }: { role?: Role }) {
  /**
   * If no role is provided default to patient
   */
  const urls = allowedUrls[role ?? 'PATIENT']
  return (
    <GSidebar>
      <Nav>
        {urls.map((link) => (
          <SidebarButton href={link} key={link} label="TEST" />
        ))}
      </Nav>
    </GSidebar>
  )
}
