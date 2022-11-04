import { Add, Close, Email } from '@carbon/icons-react'
import {
  Box,
  Button,
  Layer,
  Heading,
  FormField,
  TextInput,
  Select,
  Text
} from 'grommet'
import { useState } from 'react'
import useTeam from '../hooks/team'
import { Permissions, User } from '../types/types'

export default function InviteStaff({ user }: { user: User }) {
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false)
  const [permissions, setPermissions] = useState<Permissions>(
    Permissions.Member
  )

  const { addTeamMember } = useTeam(user)
  return (
    <Box direction="row" align="right">
      <Button
        icon={<Add size={16} />}
        label="Add Team Member"
        size="small"
        onClick={() => setShowAddUserModal(true)}
      />
      {showAddUserModal && (
        <Layer
          onEsc={() => setShowAddUserModal(false)}
          onClickOutside={() => setShowAddUserModal(false)}
          position="right"
          full="vertical"
        >
          <Box pad="medium">
            <Box flex={false} direction="row" justify="between">
              <Heading level={4} margin="none">
                Add Teammate
              </Heading>
              <Button
                icon={<Close />}
                onClick={() => setShowAddUserModal(false)}
              />
            </Box>
            <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
              <FormField label="Email">
                <TextInput icon={<Email size={16} type="email" />} />
              </FormField>
              <FormField>
                <Text size="small">
                  <Select
                    options={[Permissions.Admin, Permissions.Member]}
                    defaultValue={Permissions.Member}
                    onChange={({ value }) => setPermissions(value)}
                  >
                    {(option) => (
                      <Box pad="xsmall">
                        <Text size="small">{option}</Text>
                      </Box>
                    )}
                  </Select>
                </Text>
              </FormField>
            </Box>
            <Box flex={false} as="footer" align="start">
              <Button
                type="submit"
                label="Submit"
                onClick={() => setShowAddUserModal(false)}
                primary
              />
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  )
}
