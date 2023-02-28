import Head from 'next/head'
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  MaskedInput,
  Menu,
  Text,
  TextInput
} from 'grommet'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../../helpers/user-details'
import Page from '../../../components/Page'
import { ServerPageProps } from '../../../types/types'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { useRouter } from 'next/router'
import usePatient from '../../../hooks/patient'
import {
  emailValidator,
  phoneNumberValidator
} from '../../../helpers/validators'
import theme from '../../../styles/theme'
import {
  Add,
  Close,
  Email,
  Launch,
  Phone,
  TrashCan,
  UpdateNow,
  User as UserIcon,
  UserAvatar
} from '@carbon/icons-react'

import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAtom } from 'jotai'
import { addPatientModalState } from '../../../components/AddPatientModal'
import NotFound from '../../../public/not-found.svg'
import Image from 'next/image'
import DeletePatientModal from '../../../components/DeletePatientModal'

const PatientPage = ({ user: currentUser }: ServerPageProps) => {
  const router = useRouter()
  const { patientId } = router.query
  const [, setShowAddPatientModal] = useAtom(addPatientModalState)

  // cast to string to be safe
  const { patient, error, isLoading, updatePickup, deletePatient } = usePatient(
    `${patientId}`
  )

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  async function handleDeletePatient() {
    const deleted = await deletePatient()
    if (deleted) {
      setShowDeleteModal(false)
      router.push('/patients')
    }
  }

  const [patientFirstName, setPatientFirstName] = useState<string | undefined>(
    patient?.User.firstName
  )
  const [patientLastName, setPatientLastName] = useState<string | undefined>(
    patient?.User.lastName
  )
  const [patientEmail, setPatientEmail] = useState<string | undefined>(
    patient?.User.email
  )
  const [patientPhoneNumber, setPatientPhoneNumber] = useState<
    string | undefined
  >(patient?.User.phoneNumber)

  let patientFullName: string | undefined

  if (isLoading) {
    return (
      <Box pad="medium">
        <Skeleton count={2} />
      </Box>
    )
  }

  if (patient && !error) {
    patientFullName = `${patientFirstName} ${patientLastName}` ?? '... ...'

    return (
      <>
        {showDeleteModal && (
          <DeletePatientModal
            patientFullName={patientFullName}
            onClose={() => setShowDeleteModal(false)}
            onSubmit={handleDeletePatient}
          />
        )}
        <Head>
          <title>Edit Patient | {patientFullName}</title>
          <meta
            name="description"
            content="Pharmabox Notifications. Login to continue"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Page user={currentUser}>
          <Box basis="auto" fill="horizontal">
            <Header>
              <Box>
                <Breadcrumbs
                  pages={['Patients', `${patientFullName}`, 'Edit']}
                />
              </Box>
            </Header>
            <Box pad={{ left: 'medium', right: 'medium' }}>
              <Box direction="column" gap="small">
                <Form>
                  <Box
                    border
                    round="xsmall"
                    margin={{ vertical: 'medium' }}
                    overflow="scroll"
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
                        value={patientFirstName}
                        onChange={(e) => setPatientFirstName(e.target.value)}
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
                        value={patientLastName}
                        onChange={(e) => setPatientLastName(e.target.value)}
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
                        value={patientPhoneNumber}
                        onChange={(e) => setPatientPhoneNumber(e.target.value)}
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
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                      />
                    </FormField>
                    <Box flex={false} as="footer" gap="small">
                      <Box pad={{ left: 'small', bottom: 'small' }}>
                        <Text size="small">
                          Verify with the patient that the information you have
                          entered is corrrect.
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box direction="row" gap="medium" justify="between">
                    <Button
                      icon={<TrashCan size={16} />}
                      label="Delete Patient"
                      secondary
                      color={theme.global.colors['status-critical']}
                      style={{ color: theme.global.colors['status-critical'] }}
                      onClick={() => setShowDeleteModal(true)}
                    />
                    <Button
                      icon={<UpdateNow size={16} />}
                      type="submit"
                      label="Update Patient Information"
                      primary
                    />
                  </Box>
                </Form>
              </Box>
            </Box>
          </Box>
        </Page>
      </>
    )
  }
  return (
    <>
      <Head>
        <title>Patients | Not Found</title>
        <meta
          name="description"
          content="Pharmabox Notifications. Login to continue"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page user={currentUser}>
        <Box
          animation="fadeIn"
          direction="column"
          align="start"
          className="Settings"
          fill="horizontal"
        >
          <Box basis="auto" fill="horizontal">
            <Header>
              <Box>
                <Breadcrumbs pages={['Patients', 'Not Found']} />
              </Box>
            </Header>
            <Box pad="medium">
              <Box
                direction="column"
                border
                pad="medium"
                round="small"
                align="center"
                gap="medium"
              >
                <Image
                  src={NotFound}
                  alt="Not Found"
                  width={656 / 2}
                  height={458.68642 / 2}
                />
                <Text
                  size="small"
                  color={theme.global.colors['status-critical']}
                >
                  The patient you are looking for does not exist in the
                  Pharmabox Database.
                </Text>
                <Box width="medium">
                  <Button
                    label="New Patient"
                    primary
                    size="small"
                    fill={false}
                    onClick={() => setShowAddPatientModal(true)}
                    icon={<Add size={16} />}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  )
}

export default PatientPage

export const getServerSideProps = withServerSideAuth(
  async ({ req, res }) =>
    SSRUser({
      req,
      res,
      query: { include: { Staff: true, Pharmacist: true } }
    }),
  { loadUser: true }
)
