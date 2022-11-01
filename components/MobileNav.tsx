import React from 'react'
import { PatientRootPages, Role, StaffRootPages } from '../types/types'
import { allowedUrls } from './Sidebar'
import { Anchor, Button, Header, Menu, Nav, ResponsiveContext } from 'grommet'
import MobileBarButton from './MobileBarButton'
import theme from '../styles/theme'

export default function CollapsableNav({ role }: { role?: Role }) {
  const urls = allowedUrls[role ?? 'patient']
  return (
    <Header
      background={theme.global.colors['neutral-2']}
      //   height="xxsmmall"
      border={{
        color: theme.global.colors['light-1'],
        side: 'bottom',
        size: 'xsmall',
        style: 'inset'
      }}
      pad="small"
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
        zIndex: 2,
        width: '100vw'
      }}
    >
      <Nav
        direction="row"
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '100%'
        }}
      >
        {urls.map(
          ({ link, name, Icon }) =>
            name !== '' && (
              <MobileBarButton
                href={link}
                key={link}
                label={name}
                icon={Icon}
              />
            )
        )}
      </Nav>
    </Header>
  )
}
