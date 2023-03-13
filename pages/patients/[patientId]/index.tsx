import Head from 'next/head'
import { Anchor, Box, Button, CheckBox, Header, Menu, Text } from 'grommet'
import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { SSRUser } from '../../../helpers/user-details'
import Page from '../../../components/Page'
import { ServerPageProps, User } from '../../../types/types'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { useRouter } from 'next/router'
import usePatient from '../../../hooks/patient'
import { formatPhoneNumber } from '../../../helpers/validators'
import theme from '../../../styles/theme'
import {
  Add,
  Edit,
  OverflowMenuHorizontal,
  PillsAdd,
  TrashCan
} from '@carbon/icons-react'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAtom } from 'jotai'
import { addPatientModalState } from '../../../components/AddPatientModal'
import NotFound from '../../../public/not-found.svg'
import Image from 'next/image'
import DeletePatientModal from '../../../components/DeletePatientModal'
import useAuthorization from '../../../hooks/authorization'
import {
  createPrescriptionModalState,
  patient as selectedPatient,
  showPatientsTable
} from '../../../components/CreatePrescriptionModal'
import {
  usePatientPrescriptions,
  usePrescriptions
} from '../../../hooks/prescriptions'
import ActivePrescriptionsCard from '../../../components/ActivePrescriptionsCard'
import PrevPrescriptionsCard from '../../../components/PrevPrescriptionsCard'

const PatientPage = ({ user: currentUser }: ServerPageProps) => {
  const router = useRouter()
  const { patientId } = router.query
  const [, setShowAddPatientModal] = useAtom(addPatientModalState)
  const { isAuthorized } = useAuthorization(currentUser)

  // cast to string to be safe
  const { patient, error, isLoading, updatePickup, deletePatient } = usePatient(
    `${patientId}`
  )
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [, setShowCreatePrescriptionModal] = useAtom(
    createPrescriptionModalState
  )

  const { sendPickupReminder, deletePrescription, markPrescriptionPickedUp } =
    usePrescriptions({
      user: currentUser
    })
  const [, setPatient] = useAtom(selectedPatient)
  const [, setShowTable] = useAtom(showPatientsTable)

  async function handleDeletePatient() {
    const deleted = await deletePatient()
    if (deleted) {
      setShowDeleteModal(false)
      router.push('/patients')
    }
  }

  function handleCreatePrescription() {
    setShowCreatePrescriptionModal(true)
    setShowTable(false)
    if (patient) {
      let user = patient.User
      user.Patient = patient
      setPatient(user)
    }
  }
  const { activePrescriptions, prevPrescriptions } = usePatientPrescriptions(
    patient?.id
  )

  let patientFirstName: string | undefined
  let patientLastName: string | undefined
  let patientEmail: string | undefined
  let patientPhoneNumber: string | undefined
  let patientFullName: string | undefined
  let patientPickupEnabled: boolean = false

  if (isLoading) {
    return (
      <Box pad="medium">
        <Skeleton count={2} />
      </Box>
    )
  }

  if (patient && !error) {
    const { User, pickupEnabled } = patient
    patientFirstName = User?.firstName ?? '...'
    patientLastName = User?.lastName ?? '...'
    patientEmail = User?.email ?? '...@...'
    patientPhoneNumber = User?.phoneNumber ?? '(...) ... ...'
    patientPickupEnabled = pickupEnabled
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
          <title>Patients | {patientFullName}</title>
          <meta
            name="description"
            content="Pharmabox Notifications. Login to continue"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Page user={currentUser}>
          <Box animation="fadeIn" align="start" className="Patients Page">
            <Box basis="auto" fill="horizontal" overflow="scroll">
              <Header>
                <Box>
                  <Breadcrumbs pages={['Patients', `${patientFullName}`]} />
                </Box>
                <Box pad={{ right: 'medium' }}>
                  <Menu
                    data-cy="dots-menu"
                    dropProps={{
                      align: { top: 'bottom', right: 'left' },
                      round: 'small'
                    }}
                    size="small"
                    items={[
                      {
                        label: <Text size="small">Edit Patient</Text>,
                        icon: <Edit size={20} />,
                        gap: 'small',
                        onClick: () =>
                          router.push(`/patients/${patientId}/edit`)
                      },
                      {
                        label: (
                          <Text
                            size="small"
                            color={theme.global.colors['status-critical']}
                          >
                            Delete Patient
                          </Text>
                        ),
                        icon: (
                          <TrashCan
                            size={20}
                            color={theme.global.colors['status-critical']}
                          />
                        ),
                        gap: 'small',
                        onClick: () => setShowDeleteModal(true)
                      }
                    ]}
                    icon={<OverflowMenuHorizontal size={24} />}
                  />
                </Box>
              </Header>
              <Box
                pad="medium"
                gap="medium"
                className="contents"
                style={{ display: 'block' }}
              >
                <Box direction="row" align="right">
                  <Button
                    icon={<PillsAdd size={16} />}
                    label={
                      !isAuthorized
                        ? 'You Must be Authorized to Add a New Prescription'
                        : `Add New Prescription for ${patientFirstName} ${patientLastName}`
                    }
                    primary
                    fill="horizontal"
                    size="medium"
                    onClick={handleCreatePrescription}
                    disabled={!isAuthorized}
                    data-cy="create-prescription-button"
                    style={{ borderRadius: '10px' }}
                  />
                </Box>
                <Box
                  direction="row"
                  border
                  pad="medium"
                  round="small"
                  flex="grow"
                  gap="large"
                  alignContent="between"
                >
                  <Box direction="column" gap="small">
                    <Text size="xsmall">First Name:</Text>
                    <Text size="small">{patientFirstName}</Text>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">Last Name:</Text>
                    <Text size="small">{patientLastName}</Text>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">Email</Text>
                    <Anchor
                      weight="normal"
                      target="_blank"
                      href={`mailto:${patientEmail}`}
                      size="small"
                    >
                      {patientEmail}
                    </Anchor>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">Phone Number</Text>
                    <Anchor
                      weight="normal"
                      target="_blank"
                      href={`tel:${patientPhoneNumber}`}
                      size="small"
                    >
                      {formatPhoneNumber(`${patientPhoneNumber}`)}
                    </Anchor>
                  </Box>
                  <Box direction="column" gap="small">
                    <Text size="xsmall">
                      Pickup Status{' '}
                      {!patientPickupEnabled && (
                        <Text
                          size="xsmall"
                          color={theme.global.colors['status-error']}
                        >
                          Off
                        </Text>
                      )}
                    </Text>
                    <CheckBox
                      toggle
                      label="Pickup Enabled"
                      checked={patientPickupEnabled}
                      onChange={(event) =>
                        updatePickup({
                          pickupEnabled: event.target.checked
                        })
                      }
                    />
                  </Box>
                </Box>
                <Box gap="small" round="small">
                  <Text weight="bold">Prescriptions Awaiting Pickup</Text>
                  <Box gap="medium">
                    {activePrescriptions?.map(
                      ({
                        id,
                        name,
                        createdTime,
                        LockerBox,
                        Patient,
                        Staff,
                        Pharmacist
                      }) => (
                        <div key={LockerBox.label}>
                          <ActivePrescriptionsCard
                            id={id}
                            name={name}
                            createdTime={createdTime as Date}
                            Patient={Patient}
                            Staff={Staff}
                            LockerBox={LockerBox}
                            Pharmacist={Pharmacist}
                            deletePrescription={deletePrescription}
                            sendPickupReminder={sendPickupReminder}
                            markPrescriptionPickedUp={markPrescriptionPickedUp}
                          />
                        </div>
                      )
                    )}
                  </Box>
                </Box>
                <Box gap="small" round="small">
                  <Text weight="bold">Previous Prescriptions</Text>
                  <Box gap="medium">
                    {prevPrescriptions?.map(
                      ({
                        id,
                        name,
                        createdTime,
                        LockerBox,
                        Patient,
                        Staff,
                        Pharmacist
                      }) => (
                        <div key={LockerBox.label}>
                          <PrevPrescriptionsCard
                            id={id}
                            name={name}
                            createdTime={createdTime as Date}
                            Patient={Patient}
                            Staff={Staff}
                            LockerBox={LockerBox}
                            Pharmacist={Pharmacist}
                          />
                        </div>
                      )
                    )}
                  </Box>
                </Box>
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
