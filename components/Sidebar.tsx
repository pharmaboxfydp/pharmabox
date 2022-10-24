import { Sidebar as GSidebar, Nav } from 'grommet'
import theme from '../styles/theme'
import { PatientRootPages, Role, StaffRootPages } from '../types/types'
import SidebarButton from './SidebarButton'
import { useClerk } from '@clerk/clerk-react'
import {
  Add,
  Home,
  Dashboard,
  WatsonHealthNominate,
  Notification,
  Purchase,
  Settings,
  Schematics,
  Collaborate,
  Catalog,
  Logout
} from '@carbon/icons-react'

export const allowedUrls: Record<
  Role,
  Array<{
    link: StaffRootPages | PatientRootPages
    name: string
    Icon: JSX.Element
  }>
> = {
  patient: [
    {
      link: PatientRootPages.Home,
      name: 'Home',
      Icon: <Home size={24} />
    },
    {
      link: PatientRootPages.Payments,
      name: 'Payments',
      Icon: <Purchase size={24} />
    },
    {
      link: PatientRootPages.Notifications,
      name: 'Notifications',
      Icon: <Notification size={24} />
    },
    {
      link: PatientRootPages.Settings,
      name: 'Settings',
      Icon: <Settings size={24} />
    }
  ],
  staff: [
    {
      link: StaffRootPages.Home,
      name: 'Dashboard',
      Icon: <Dashboard size={24} />
    },
    {
      link: StaffRootPages.Patients,
      name: 'Patients',
      Icon: <WatsonHealthNominate size={24} />
    },
    {
      link: StaffRootPages.Workflows,
      name: 'Workflows',
      Icon: <Schematics size={24} />
    },
    {
      link: StaffRootPages.Team,
      name: 'Team',
      Icon: <Collaborate size={24} />
    },
    {
      link: StaffRootPages.Logbook,
      name: 'Logbook',
      Icon: <Catalog size={24} />
    },
    {
      link: PatientRootPages.Settings,
      name: 'Settings',
      Icon: <Settings size={24} />
    }
  ]
}

export default function Sidebar({ role }: { role?: Role }) {
  const { signOut } = useClerk()

  /**
   * If no role is provided default to patient
   */
  const urls = allowedUrls[role ?? 'patient']
  return (
    <GSidebar
      background={theme.global.colors['neutral-2']}
      height="100%"
      footer={
        <Nav gap="xsmall">
          <SidebarButton
            href="/settings"
            label="Settings"
            icon={<Settings size={24} />}
          />
          <SidebarButton
            label="Logout"
            onClick={signOut}
            icon={<Logout size={24} />}
          />
        </Nav>
      }
    >
      <Nav gap="xsmall">
        {urls.map(
          ({ link, name, Icon }) =>
            name !== 'Settings' && (
              <SidebarButton href={link} key={link} label={name} icon={Icon} />
            )
        )}
      </Nav>
    </GSidebar>
  )
}
