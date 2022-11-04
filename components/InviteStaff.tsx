import { Add, Close, Email, Rule } from '@carbon/icons-react'
import {
  Box,
  Button,
  Layer,
  Heading,
  FormField,
  TextInput,
  Select,
  Text,
  Form,
  Spinner
} from 'grommet'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useTeam from '../hooks/team'
import { Permissions, User } from '../types/types'

export default function InviteStaff({ user }: { user: User }) {
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false)
  const [permissions, setPermissions] = useState<Permissions>(
    Permissions.Member
  )
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const { addTeamMember } = useTeam(user)

  async function handleSubmit(data: {
    value: { userPermissions: Permissions; userEmail: string }
  }): Promise<boolean> {
    setIsFetching(true)
    const { userEmail, userPermissions } = data.value
    const isAdmin = userPermissions === Permissions.Admin ?? false

    if (!user.Staff?.locationId) {
      toast.error('You do not have permissons to add this user', { icon: '❌' })
      return false
    }
    const response = await addTeamMember({
      email: userEmail,
      isAdmin,
      locationId: user.Staff.locationId
    })
    if (response.message === 'Success') {
      setShowAddUserModal(false)
    }
    setIsFetching(false)
    return true
  }

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
            {!isFetching ? (
              <>
                <Box flex={false} direction="row" justify="between">
                  <Heading level={4} margin="none">
                    Add Teammate
                  </Heading>

                  <Button
                    icon={<Close />}
                    onClick={() => setShowAddUserModal(false)}
                  />
                </Box>
                <Box width="medium" gap="small">
                  <Text size="small">
                    You can add someone by providing their email. If they
                    already have an account we will add them to the team right
                    away.
                  </Text>
                  <Text size="small">
                    If they do not yet have an account, we will send them an
                    invite email.
                  </Text>
                </Box>
                <Form onSubmit={handleSubmit}>
                  <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
                    <FormField label="Email" htmlFor="userEmail" name="email">
                      <TextInput
                        icon={<Email size={16} type="email" />}
                        size="small"
                        reverse
                        id="userEmail"
                        name="userEmail"
                      />
                    </FormField>
                    <FormField
                      lable="Permissions"
                      htmlFor="userPermissions"
                      name="permissons"
                    >
                      <Select
                        options={[
                          `${Permissions.Admin}`,
                          `${Permissions.Member}`
                        ]}
                        defaultValue={`${Permissions.Member}`}
                        onChange={({ value }) => {
                          setPermissions(value)
                        }}
                        icon={<Rule size={16} />}
                        value={permissions}
                        size="small"
                        id="userPermissions"
                        name="userPermissions"
                      >
                        {(option) => (
                          <Box pad="xsmall">
                            <Text size="small">{option}</Text>
                          </Box>
                        )}
                      </Select>
                    </FormField>
                  </Box>
                  <Box flex={false} as="footer" align="start">
                    <Button type="submit" label="Invite" primary />
                  </Box>
                </Form>
              </>
            ) : (
              <Box pad="xlarge" align="center" gap="medium" animation="fadeIn">
                <Text>Inviting Teammate...</Text>
                <Spinner
                  size="xlarge"
                  border={false}
                  background="linear-gradient(to right, #fc466b, #683ffb)"
                />
              </Box>
            )}
          </Box>
        </Layer>
      )}
    </Box>
  )
}
