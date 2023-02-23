import {
  Add,
  Close,
  Email,
  Launch,
  Phone,
  Rule,
  User as UserIcon,
  UserAvatar
} from '@carbon/icons-react'
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
  Spinner,
  Anchor,
  MaskedInput
} from 'grommet'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { emailValidator, phoneNumberValidator } from '../helpers/validators'
import useTeam from '../hooks/team'
import { Permissions, User } from '../types/types'

export default function AddPatient({ user }: { user: User }) {
  const [showAddPatient, setShowAddUserModal] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [phoneValue, setPhoneValue] = useState<string>('')
  const [emailValue, setEmailValue] = useState<string>('')

  async function handleSubmit(data: any): Promise<boolean> {
    setIsFetching(true)

    const response = { message: '' }
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
        label="Add Patient"
        primary
        size="small"
        onClick={() => setShowAddUserModal(true)}
      />
      {showAddPatient && (
        <Layer
          onEsc={() => setShowAddUserModal(false)}
          onClickOutside={() => setShowAddUserModal(false)}
          position="center"
          full
        >
          <Box pad="large">
            {!isFetching ? (
              <>
                <Box flex={false} direction="row" justify="between">
                  <Heading level={4} margin="none">
                    Add Patient
                  </Heading>

                  <Button
                    icon={<Close size={16} />}
                    onClick={() => setShowAddUserModal(false)}
                  />
                </Box>
                <Box gap="small">
                  <Text size="medium">Add a patient to Pharmabox</Text>
                  <Text size="medium">
                    Remind patients that they may only use Pharmabox to pick up
                    prescription medication that are <b>not</b> considered
                    Schedule I under the{' '}
                    <Anchor
                      icon={<Launch size={16} />}
                      label="Controlled Drugs and Substances Act (S.C. 1996, c. 19)"
                      href="https://laws-lois.justice.gc.ca/eng/acts/c-38.8/page-9.html"
                      target="_blank"
                    />
                  </Text>
                </Box>
                <Box border round="small" margin={{ vertical: 'medium' }}>
                  <Form onSubmit={handleSubmit}>
                    <Box
                      flex="grow"
                      overflow="auto"
                      pad={{ vertical: 'medium' }}
                    >
                      <FormField
                        label="First Name"
                        htmlFor="userFirstName"
                        name="firstName"
                        required
                      >
                        <TextInput
                          icon={<UserIcon size={16} type="text" />}
                          size="small"
                          reverse
                          id="userFirstName"
                          name="firstName"
                          placeholder="Jane"
                          a11yTitle="First Name Input"
                        />
                      </FormField>
                      <FormField
                        label="Last Name"
                        htmlFor="userLastName"
                        name="lastName"
                        required
                      >
                        <TextInput
                          icon={<UserAvatar size={16} type="text" />}
                          size="small"
                          reverse
                          id="userLastName"
                          name="LastName"
                          placeholder="Doe"
                          a11yTitle="Last Name Input"
                        />
                      </FormField>
                      <FormField
                        label="Phone"
                        htmlFor="userPhone"
                        name="phone"
                        required
                      >
                        <MaskedInput
                          size="small"
                          reverse
                          icon={<Phone size={16} />}
                          id="userPhone"
                          name="phone"
                          a11yTitle="Phone Number Input"
                          mask={phoneNumberValidator}
                          value={phoneValue}
                          onChange={(event) =>
                            setPhoneValue(event.target.value)
                          }
                        />
                      </FormField>
                      <FormField label="Email" htmlFor="userEmail" name="email">
                        <MaskedInput
                          size="small"
                          icon={<Email size={16} type="email" />}
                          mask={emailValidator}
                          reverse
                          id="userEmail"
                          name="userEmail"
                          a11yTitle="Email Input"
                          type="email"
                          value={emailValue}
                          onChange={(event) =>
                            setEmailValue(event.target.value)
                          }
                        />
                      </FormField>
                    </Box>
                    <Box flex={false} as="footer" gap="small">
                      <Box pad={{ left: 'small' }}>
                        <Text size="medium">
                          Verify with the patient that the information you have
                          entered is corrrect.
                        </Text>
                      </Box>
                      <Button
                        type="submit"
                        label="Add Patient"
                        primary
                        style={{
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px'
                        }}
                      />
                    </Box>
                  </Form>
                </Box>
              </>
            ) : (
              <Box pad="xlarge" align="center" gap="medium" animation="fadeIn">
                <Text>Adding Patient...</Text>
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