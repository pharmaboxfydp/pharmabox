import { Sidebar as GSidebar, Nav } from 'grommet'
import theme from '../styles/theme'
import {
  PatientRootPages,
  PharmacistRootPages,
  Role,
  StaffRootPages
} from '../types/types'
import SidebarButton from './SidebarButton'
import { useClerk } from '@clerk/clerk-react'
import {
  Home,
  Dashboard,
  WatsonHealthNominate,
  Purchase,
  Settings,
  Schematics,
  Collaborate,
  Catalog,
  Logout
} from '@carbon/icons-react'
import { useEffect } from 'react'

export const allowedUrls: Record<
  Role,
  Array<{
    link: StaffRootPages | PatientRootPages | PharmacistRootPages
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
  ],
  pharmacist: [
    {
      link: PharmacistRootPages.Home,
      name: 'Dashboard',
      Icon: <Dashboard size={24} />
    },
    {
      link: PharmacistRootPages.Patients,
      name: 'Patients',
      Icon: <WatsonHealthNominate size={24} />
    },
    {
      link: PharmacistRootPages.Workflows,
      name: 'Workflows',
      Icon: <Schematics size={24} />
    },
    {
      link: PharmacistRootPages.Team,
      name: 'Team',
      Icon: <Collaborate size={24} />
    },
    {
      link: PharmacistRootPages.Logbook,
      name: 'Logbook',
      Icon: <Catalog size={24} />
    },
    {
      link: PharmacistRootPages.Settings,
      name: 'Settings',
      Icon: <Settings size={24} />
    }
  ]
}

export default function Sidebar({ role }: { role?: Role }) {
  const { signOut } = useClerk()

  function handleKeyboardEvent(event: KeyboardEvent) {
    const element = event.target as HTMLElement
    const shouldTrigger =
      element?.tagName === 'BODY' && event.key === 'L' && event.shiftKey
    if (shouldTrigger) {
      signOut()
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', handleKeyboardEvent)
    return () => {
      document.removeEventListener('keypress', handleKeyboardEvent)
    }
  })

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
      flex="grow"
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
