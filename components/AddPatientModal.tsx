import {
  Add,
  Close,
  Email,
  Launch,
  Phone,
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
  Text,
  Form,
  Spinner,
  Anchor,
  MaskedInput,
  FormExtendedEvent
} from 'grommet'
import { useState } from 'react'
import { atom, useAtom } from 'jotai'
import { emailValidator, phoneNumberValidator } from '../helpers/validators'
import usePatients, { NewPatient } from '../hooks/patients'

/**
 * imparatively define an atom
 * so that we do not loose our pagination when navigating
 * to a different page
 */
export const addPatientModalState = atom<boolean>(false)

export default function AddPatientModal() {
  const [showAddPatient, setShowAddPatientModal] = useAtom(addPatientModalState)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [phoneValue, setPhoneValue] = useState<string>('')
  const [emailValue, setEmailValue] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const { addPatient } = usePatients()

  async function handleSubmit(
    event: FormExtendedEvent<NewPatient>
  ): Promise<boolean> {
    setIsFetching(true)
    const { value } = event
    const res = await addPatient(value)
    setIsFetching(false)
    if (res.message === 'Success') {
      clearForm()
    }

    return true
  }

  function clearForm() {
    setPhoneValue('')
    setEmailValue('')
    setFirstName('')
    setLastName('')
  }

  return showAddPatient ? (
    <Layer
      onEsc={() => setShowAddPatientModal(false)}
      onClickOutside={() => setShowAddPatientModal(false)}
      position="center"
      full
      style={{ display: 'block', overflow: 'scroll' }}
    >
      <Box pad="large" overflow="scroll">
        {!isFetching ? (
          <Box direction="column" overflow="scroll" gap="small">
            <Box flex={false} direction="row" justify="between">
              <Heading level={4} margin="none">
                Add Patient
              </Heading>
              <Button
                icon={<Close size={16} />}
                onClick={() => setShowAddPatientModal(false)}
              />
            </Box>
            <Box gap="small">
              <Text size="medium">Add a patient to Pharmabox</Text>
              <Text size="medium">
                Remind patients that they may only use Pharmabox to pick up
                prescription medication that are <b>not</b> considered Schedule
                I under the{' '}
                <Anchor
                  icon={<Launch size={16} />}
                  label="Controlled Drugs and Substances Act (S.C. 1996, c. 19)"
                  href="https://laws-lois.justice.gc.ca/eng/acts/c-38.8/page-9.html"
                  target="_blank"
                />
              </Text>
            </Box>
            <Box
              border
              round="small"
              margin={{ vertical: 'medium' }}
              overflow="scroll"
            >
              <Form onSubmit={handleSubmit}>
                <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
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
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
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
                      name="lastName"
                      placeholder="Doe"
                      a11yTitle="Last Name Input"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                  </FormField>
                  <FormField
                    label="Phone"
                    htmlFor="phone"
                    name="phone"
                    required
                  >
                    <MaskedInput
                      size="small"
                      reverse
                      icon={<Phone size={16} />}
                      id="phone"
                      name="phone"
                      a11yTitle="Phone Number Input"
                      mask={phoneNumberValidator}
                      value={phoneValue}
                      onChange={(event) => setPhoneValue(event.target.value)}
                    />
                  </FormField>
                  <FormField label="Email" htmlFor="email" name="email">
                    <MaskedInput
                      size="small"
                      icon={<Email size={16} type="email" />}
                      mask={emailValidator}
                      reverse
                      id="email"
                      name="email"
                      a11yTitle="Email Input"
                      type="email"
                      value={emailValue}
                      onChange={(event) => setEmailValue(event.target.value)}
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
            <Text size="small">
              Tip: You can open the patient creation window from anywhere using
              the <kbd>F1</kbd> Key, and close it using the <kbd>Esc</kbd> key.
            </Text>
          </Box>
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
  ) : null
}
