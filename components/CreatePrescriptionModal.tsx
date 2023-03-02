import { Close } from '@carbon/icons-react'
import {
  Box,
  Button,
  Layer,
  Heading,
  FormField,
  Text,
  Form,
  Spinner,
  Anchor,
  FormExtendedEvent,
  TextArea,
  Select
} from 'grommet'
import { useState } from 'react'
import { atom, useAtom } from 'jotai'
import { ServerPageProps, User } from '../types/types'
import PatientsTable, { PatientsPageState } from './PatientsTable'
import theme from '../styles/theme'
import { formatPhoneNumber } from '../helpers/validators'
import { useLockerboxes } from '../hooks/lockerbox'

/**
 * imparatively define an atom
 * so that we do not loose our pagination when navigating
 * to a different page
 */
export const createPrescriptionModalState = atom<boolean>(false)

const patientsSearchPaginationState = atom<PatientsPageState>({
  step: '3',
  page: '1'
})

export default function CreatePrescriptionModal({ user }: ServerPageProps) {
  const [showCreatePrescription, setShowCreatePrescriptionModal] = useAtom(
    createPrescriptionModalState
  )
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [prescriptionName, updatePrescriptionName] = useState<string>('')
  const { emptyLockerboxes } = useLockerboxes(user)
  const [prescriptionLocker, updatePrescriptionLocker] = useState<number>(
    emptyLockerboxes?.map((locker) => locker.label)[0] ?? 1
  )

  async function handleSubmit(event: FormExtendedEvent) {
    const { value } = event
    //setIsFetching(true)
  }

  function clearForm() {}

  function handleRowClick(datum: User) {
    setSelectedPatient(datum)
  }

  function closeModal() {
    clearForm()
    setShowCreatePrescriptionModal(false)
  }

  if (showCreatePrescription) {
    return (
      <Layer
        onEsc={closeModal}
        onClickOutside={closeModal}
        position="center"
        full
        style={{ display: 'block', overflow: 'scroll' }}
      >
        <Box pad="large" overflow="scroll">
          {!isFetching && emptyLockerboxes?.length && (
            <Box
              direction="column"
              overflow="scroll"
              gap="small"
              data-cy="create-prescription-modal"
            >
              <Box flex={false} direction="row" justify="between">
                <Heading level={4} margin="none">
                  Create Prescription
                </Heading>
                <Button
                  icon={<Close size={16} />}
                  onClick={closeModal}
                  data-cy="close-modal"
                />
              </Box>
              <Box margin={{ vertical: 'medium' }} overflow="scroll">
                <Form onSubmit={handleSubmit}>
                  <Box gap="medium">
                    <Box border pad="small" round="small">
                      <PatientsTable
                        patientsPageState={patientsSearchPaginationState}
                        defaultPage={1}
                        defaultStep={3}
                        onRowClickOverride={handleRowClick}
                        filterOnEnabled
                      />
                    </Box>
                    {selectedPatient ? (
                      <Box
                        border={{ color: theme.global.colors['neutral-2'] }}
                        round="small"
                      >
                        <Box
                          direction="row"
                          gap="small"
                          pad="medium"
                          align="center"
                          justify="stretch"
                        >
                          <Text size="medium">
                            First Name:{' '}
                            <Anchor
                              href={`/patients/${selectedPatient.Patient?.id}`}
                            >
                              {selectedPatient.firstName}
                            </Anchor>
                          </Text>
                          <Text>
                            Last Name:{' '}
                            <Anchor
                              href={`/patients/${selectedPatient.Patient?.id}`}
                            >
                              {selectedPatient.lastName}
                            </Anchor>
                          </Text>
                          <Text>
                            Phone Number:{' '}
                            <Anchor
                              href={`/patients/${selectedPatient.Patient?.id}`}
                            >
                              {formatPhoneNumber(
                                `${selectedPatient.phoneNumber}`
                              )}
                            </Anchor>
                          </Text>
                          <Text>
                            Email:{' '}
                            <Anchor
                              href={`/patients/${selectedPatient.Patient?.id}`}
                            >
                              {selectedPatient.email}
                            </Anchor>
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        border={{
                          color: theme.global.colors['status-critical']
                        }}
                        round="small"
                        pad="medium"
                      >
                        <Text color={theme.global.colors['status-critical']}>
                          Select Patient From Table
                        </Text>
                      </Box>
                    )}
                    <Box border round="small" pad="medium">
                      <FormField
                        label="Prescription Name / Description"
                        htmlFor="prescriptionName"
                        name="prescriptionName"
                        required
                      >
                        <TextArea
                          size="small"
                          id="prescriptionName"
                          name="prescriptionName"
                          placeholder="Name / Description"
                          a11yTitle="Prescription Name Input"
                          value={prescriptionName}
                          onChange={(event) =>
                            updatePrescriptionName(event.target.value)
                          }
                        />
                      </FormField>
                    </Box>
                    <Box border round="small" pad="medium">
                      <FormField
                        label="Locker Box"
                        htmlFor="lockerBox"
                        name="lockerBox"
                      >
                        <Select
                          id="lockerBox"
                          name="lockerBox"
                          options={
                            emptyLockerboxes?.map((locker) => locker.label) ??
                            []
                          }
                          onChange={({ option }) => {
                            updatePrescriptionLocker(option)
                          }}
                          defaultValue={
                            emptyLockerboxes?.map(
                              (locker) => locker.label
                            )[0] ?? 1
                          }
                        />
                      </FormField>
                    </Box>
                  </Box>
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
                      label="Create Prescription"
                      id="submit-create-prescription-form"
                      primary
                      data-cy="submit-create-prescription-form"
                    />
                  </Box>
                </Form>
              </Box>
            </Box>
          )}
          {isFetching && (
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
    )
  }

  return null
}
