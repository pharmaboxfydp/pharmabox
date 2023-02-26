import {
  DataTable,
  Text,
  Box,
  Pagination,
  TextInput,
  Anchor,
  ResponsiveContext,
  Header
} from 'grommet'
import { atom, useAtom } from 'jotai'
import Skeleton from 'react-loading-skeleton'
import {
  Email,
  ErrorFilled,
  LetterFf,
  LetterLl,
  Phone
} from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import usePatients from '../hooks/patients'
import { useRouter } from 'next/router'
import { isEmpty, isEqual } from 'lodash'
import { useContext } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export type PatientsPageState = {
  step: string
  page: string
}

export interface UpdateQueryParams {
  page: number
  startIndex: number
  endIndex: number
}

/**
 * imparatively define an atom
 * so that we do not loose our pagination when navigating
 * to a different page
 */
const patientsPaginationState = atom<PatientsPageState>({
  step: '5',
  page: '1'
})

const DEBOUNCE_MS: number = 500
const FALLBACK_PATIENTS_PER_PAGE: number = 10
const MAX_ALLOWABLE_PATIENT_DISPLAYED: number = 300

export default function PatientsTable() {
  const size = useContext(ResponsiveContext)
  const [pageState, updatePageState] = useAtom(patientsPaginationState)
  const router = useRouter()

  function updateQueryParams({
    page,
    startIndex,
    endIndex
  }: UpdateQueryParams) {
    const newState = {
      step: (endIndex - startIndex).toString(),
      page: page.toString()
    }
    updatePageState(newState)
    quietlySetQuery(newState)
  }

  const debounceStepSizeChange = useDebouncedCallback(
    (step: string) =>
      updateQueryParams({
        endIndex: parseInt(step),
        startIndex: 0,
        page: parseInt(router?.query?.page as string)
      }),
    DEBOUNCE_MS
  )

  function quietlySetQuery(state: PatientsPageState) {
    router.push(
      `${router.pathname}/?${new URLSearchParams(state).toString()}`,
      undefined,
      { shallow: true }
    )
  }

  /**
   * if there is no query present, then set it to the default
   */
  if (isEmpty(router.query)) {
    quietlySetQuery(pageState)
  } else {
    /**
     * if there is a valid query present then use that
     */
    if (!isEqual(router.query, pageState)) {
      if (router.query.step && router.query.page) {
        updatePageState(router.query as PatientsPageState)
      } else {
        /**
         * otherwise use the default since the curernt one is not valid
         */
        quietlySetQuery(pageState)
      }
    }
  }

  const {
    isLoading,
    isError,
    patients,
    numPatients: totalPatientsCount
  } = usePatients(router.query)

  const step: number = parseInt(router?.query?.step as string) ?? 5
  const page: number = parseInt(router?.query?.page as string) ?? 1
  const shouldPinColums = size === 'small'

  if (isLoading && !isError) {
    return (
      <Box gap="medium">
        <Skeleton count={1} height={30} />
        <Skeleton count={5} height={30} style={{ lineHeight: '3' }} />
      </Box>
    )
  }

  if (isError) {
    return (
      <CardNotification>
        <ErrorFilled size={32} color={theme.global.colors['status-error']} />
        <Text textAlign="center">
          Oops! It looks like Pharmabox was not able to load patients. Try
          refreshing your page. If the issue persists, contact your system
          administrator.
        </Text>
      </CardNotification>
    )
  }

  return (
    <>
      <Box overflow="auto">
        <Header gap="none">
          <TextInput
            placeholder="Search By First Name"
            size="small"
            style={{ borderRadius: 0, borderRight: 0 }}
            icon={<LetterFf size={16} />}
          />
          <TextInput
            placeholder="Search By Last Name"
            size="small"
            style={{ borderRadius: 0, borderRight: 0 }}
            icon={<LetterLl size={16} />}
          />
          <TextInput
            placeholder="Search By Phone Number"
            size="small"
            style={{ borderRadius: 0, borderRight: 0 }}
            icon={<Phone size={16} />}
          />
          <TextInput
            placeholder="Search By Email"
            size="small"
            style={{ borderRadius: 0 }}
            icon={<Email size={16} />}
          />
        </Header>
        <DataTable
          sortable
          pin
          className="patients-table"
          columns={[
            {
              property: 'First Name',
              header: <Text size="small">First Name</Text>,
              render: ({ firstName }) => <Text size="small">{firstName}</Text>
            },
            {
              property: 'Family Name',
              header: <Text size="small">Last Name</Text>,
              render: ({ lastName }) => <Text size="small">{lastName}</Text>
            },

            {
              property: 'Contact',
              header: <Text size="small">Contact</Text>,
              pin: shouldPinColums,
              render: ({ phoneNumber, email }) => (
                <Box direction="column">
                  <Text size="small" color={theme.global.colors['dark-2']}>
                    <Text weight="bolder" size="small">
                      Phone:
                    </Text>{' '}
                    {phoneNumber ? (
                      phoneNumber
                    ) : (
                      <Text
                        size="small"
                        color={theme.global.colors['status-warning']}
                      >
                        -
                      </Text>
                    )}
                  </Text>
                  <Text size="small" color={theme.global.colors['dark-2']}>
                    <Text size="small" weight="bolder">
                      Email:
                    </Text>{' '}
                    <Anchor
                      weight="normal"
                      target="_blank"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </Anchor>
                  </Text>
                </Box>
              )
            },
            {
              property: 'Pickup',
              header: <Text size="small">Pickup</Text>,
              pin: shouldPinColums,
              render: (user) => (
                <Box
                  round
                  background={
                    user?.Patient?.pickupEnabled
                      ? theme.global.colors['status-ok']
                      : theme.global.colors['dark-6']
                  }
                  pad="xxsmall"
                  align="center"
                  border
                >
                  <Text size="xsmall" color={theme.global.colors.white}>
                    {user?.Patient?.pickupEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </Box>
              )
            }
          ]}
          resizeable
          data={patients ?? []}
        />
        <Box
          align="center"
          pad="medium"
          direction="row"
          gap="small"
          justify="between"
          border="top"
        >
          <Box direction="row" gap="xsmall">
            <Box pad="small">
              <Text size="xsmall">Show</Text>
            </Box>
            <Box width="xsmall">
              <TextInput
                type="number"
                size="xsmall"
                textAlign="center"
                defaultValue={step}
                style={{ height: '40px' }}
                onChange={({ target: { value } }) =>
                  debounceStepSizeChange(value)
                }
                // we cannot have less than 1 patient in a table
                min={1}
                // enforce max to prevent client-side DDoS
                max={MAX_ALLOWABLE_PATIENT_DISPLAYED}
                // enforce step size of 1
                step={1}
              />
            </Box>
            <Box pad="small">
              <Text size="xsmall">Patients / Page</Text>
            </Box>
          </Box>
          <Pagination
            step={step}
            page={page}
            numberItems={totalPatientsCount ?? FALLBACK_PATIENTS_PER_PAGE}
            onChange={({ page, startIndex, endIndex }) =>
              updateQueryParams({ page, startIndex, endIndex })
            }
          />
        </Box>
      </Box>
    </>
  )
}
