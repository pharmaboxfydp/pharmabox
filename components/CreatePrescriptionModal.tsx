import {
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

import { User } from '../types/types'

/**
 * imparatively define an atom
 * so that we do not loose our pagination when navigating
 * to a different page
 */
export const createPrescriptionModalState = atom<boolean>(false)

export default function CreatePrescriptionModal({ user }: { user: User }) {
  const [showCreatePrescription, setShowCreatePrescriptionModal] = useAtom(
    createPrescriptionModalState
  )
  const [isFetching, setIsFetching] = useState<boolean>(false)

  async function handleSubmit(event: FormExtendedEvent) {}

  function clearForm() {}

  function closeModal() {
    clearForm()
    setShowCreatePrescriptionModal(false)
  }

  return showCreatePrescription ? (
    <Layer
      onEsc={closeModal}
      onClickOutside={closeModal}
      position="center"
      full
      style={{ display: 'block', overflow: 'scroll' }}
    >
      <Box pad="large" overflow="scroll">
        {!isFetching ? (
          <Box
            direction="column"
            overflow="scroll"
            gap="small"
            data-cy="add-patients-modal"
          >
            <Box flex={false} direction="row" justify="between">
              <Heading level={4} margin="none">
                Add Patient
              </Heading>
              <Button
                icon={<Close size={16} />}
                onClick={closeModal}
                data-cy="close-modal"
              />
            </Box>
            <Box gap="small">
              <Text size="medium">Create Prescription For Pickup</Text>
            </Box>
            <Box
              border
              round="small"
              margin={{ vertical: 'medium' }}
              overflow="scroll"
            >
              <Form onSubmit={handleSubmit}>
                <Box
                  flex="grow"
                  overflow="auto"
                  pad={{ vertical: 'medium' }}
                ></Box>
                <Box flex={false} as="footer" gap="small">
                  <Box pad={{ left: 'small' }}>
                    <Text size="medium">
                      Verify the information you have entered is corrrect.
                    </Text>
                  </Box>
                  <Button
                    type="submit"
                    label="Add Patient"
                    id="submit-create-prescription-form"
                    primary
                    style={{
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px'
                    }}
                    data-cy="submit-create-prescription-form"
                  />
                </Box>
              </Form>
            </Box>
          </Box>
        ) : (
          <Box pad="xlarge" align="center" gap="medium" animation="fadeIn">
            <Text>Creating Prescription...</Text>
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
