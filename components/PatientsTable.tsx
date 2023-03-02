import {
  DataTable,
  Text,
  Box,
  Pagination,
  TextInput,
  Anchor,
  ResponsiveContext,
  Header,
  MaskedInput,
  Button
} from 'grommet'
import { atom, PrimitiveAtom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import Skeleton from 'react-loading-skeleton'
import {
  Close,
  Email,
  ErrorFilled,
  LetterFf,
  LetterLl,
  Phone
} from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import usePatients, { UserPagination, UserSearch } from '../hooks/patients'
import { useRouter } from 'next/router'
import { isEmpty, isEqual } from 'lodash'
import { useContext } from 'react'
import { useDebounce, useDebouncedCallback } from 'use-debounce'
import {
  emailValidator,
  formatPhoneNumber,
  phoneNumberValidator
} from '../helpers/validators'
import { User } from '../types/types'

export type PatientsPageState = {
  step: string
  page: string
}

export interface UpdateQueryParams {
  page: number
  startIndex: number
  endIndex: number
}

export interface PatientsTableInferface {
  patientsPageState?: PrimitiveAtom<PatientsPageState>
  defaultStep?: number
  defaultPage?: number
  filterOnEnabled?: boolean
  onRowClickOverride?: (datum: User) => void | undefined
}

/**
 * imparatively define an atom
 * so that we do not loose our pagination when navigating
 * to a different page
 */
const patientsPaginationState = atom<PatientsPageState>({
  step: '20',
  page: '1'
})

const firstNameSearch = atomWithStorage<string>('first-name-search', '')
const lastNameSearch = atomWithStorage<string>('last-name-search', '')
const phoneNumberSearch = atomWithStorage<string>('phone-number-search', '')
const emailSearch = atomWithStorage<string>('email-search', '')

const DEBOUNCE_MS: number = 500
const DEBOUNCE_MS_SEARCH: number = 1000
const FALLBACK_PATIENTS_PER_PAGE: number = 20
const MAX_ALLOWABLE_PATIENT_DISPLAYED: number = 300

export default function PatientsTable({
  patientsPageState = patientsPaginationState,
  defaultStep = 20,
  defaultPage = 1,
  filterOnEnabled = false,
  onRowClickOverride = undefined
}: PatientsTableInferface) {
  const [pS, updatePageState] = useAtom(patientsPageState)
  const [fN, updateFirstName] = useAtom(firstNameSearch)
  const [lN, updateLastName] = useAtom(lastNameSearch)
  const [pN, updatePhoneNumber] = useAtom(phoneNumberSearch)
  const [eM, updateEmail] = useAtom(emailSearch)

  const [firstName] = useDebounce(fN, DEBOUNCE_MS_SEARCH)
  const [lastName] = useDebounce(lN, DEBOUNCE_MS_SEARCH)
  const [phoneNumber] = useDebounce(pN, DEBOUNCE_MS_SEARCH)
  const [email] = useDebounce(eM, DEBOUNCE_MS_SEARCH)

  const router = useRouter()
  const size = useContext(ResponsiveContext)

  function clearSearch() {
    updateFirstName('')
    updateLastName('')
    updatePhoneNumber('')
    updateEmail('')
  }

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
    quietlySetQuery(pS)
  } else {
    /**
     * if there is a valid query present then use that
     */
    if (!isEqual(router.query, pS)) {
      if (router.query.step && router.query.page) {
        updatePageState(router.query as PatientsPageState)
      } else {
        /**
         * otherwise use the default since the curernt one is not valid
         */
        quietlySetQuery(pS)
      }
    }
  }

  const search: UserSearch = {
    firstName,
    lastName,
    phoneNumber,
    email
  }

  const {
    isLoading,
    isError,
    patients,
    numPatients: totalPatientsCount
  } = usePatients({
    pagination: router.query as unknown as UserPagination,
    search,
    filterOnEnabled
  })

  const step: number =
    parseInt(router?.query?.step as string) ?? defaultStep ?? 20
  const page: number =
    parseInt(router?.query?.page as string) ?? defaultPage ?? 1
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
        <Header gap="none" animation="slideUp" sticky="scrollup">
          <TextInput
            value={fN}
            placeholder="Search By First Name"
            a11yTitle="Search By First Name"
            size="small"
            style={{ borderRadius: 0, borderRight: 0 }}
            icon={<LetterFf size={16} />}
            onChange={(e) => updateFirstName(e.target.value)}
            data-cy="search-first-name"
          />
          <TextInput
            value={lN}
            placeholder="Search By Last Name"
            a11yTitle="Search By Last Name"
            size="small"
            style={{ borderRadius: 0, borderRight: 0 }}
            icon={<LetterLl size={16} />}
            onChange={(e) => updateLastName(e.target.value)}
            data-cy="search-last-name"
          />
          <MaskedInput
            mask={phoneNumberValidator}
            value={pN}
            placeholder="Search By Phone Number"
            size="small"
            a11yTitle="Search By Phone Number"
            style={{ borderRadius: 0, borderRight: 0 }}
            icon={<Phone size={16} />}
            onChange={(e) => updatePhoneNumber(e.target.value)}
            data-cy="search-phone-number"
          />
          <MaskedInput
            mask={emailValidator}
            a11yTitle="Search By Email"
            value={eM}
            placeholder="Search By Email"
            size="small"
            style={{ borderRadius: 0 }}
            icon={<Email size={16} />}
            onChange={(e) => updateEmail(e.target.value)}
            data-cy="search-email"
          />
          <Button
            icon={<Close size={16} />}
            onClick={clearSearch}
            tip={{ content: <Text size="xsmall">Clear Search</Text> }}
            data-cy="table-clear-search"
          />
        </Header>
        <DataTable
          pin
          className="patients-table"
          columns={[
            {
              property: 'First Name',
              header: <Text size="small">First Name</Text>,
              render: ({ firstName }) => <Text size="small">{firstName}</Text>
            },
            {
              property: 'Last Name',
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
                      formatPhoneNumber(phoneNumber)
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
              property: 'Active-Prescriptions',
              header: <Text size="small">Rx Awaiting Pickup</Text>,
              pin: shouldPinColums,
              render: ({ Patient }) => {
                const numRx = Patient?.Prescriptions.length
                return <Text size="small">{numRx}</Text>
              }
            },
            {
              property: 'Status',
              header: <Text size="small">Status</Text>,
              pin: shouldPinColums,
              render: (user) => (
                <Box
                  round
                  background={
                    user?.Patient?.pickupEnabled
                      ? theme.global.colors['status-ok']
                      : theme.global.colors['status-warning']
                  }
                  pad="xxsmall"
                  align="center"
                  border
                  width="xsmall"
                >
                  <Text size="xsmall" color={theme.global.colors.white}>
                    {user?.Patient?.pickupEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </Box>
              )
            }
          ]}
          onClickRow={({ datum }) => {
            if (onRowClickOverride) {
              onRowClickOverride(datum)
            } else {
              router.push(`/patients/${datum.Patient.id}`)
            }
          }}
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
                data-cy="step-size"
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
