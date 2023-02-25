import {
  DataTable,
  Text,
  Box,
  Pagination,
  TextInput,
  Anchor,
  ResponsiveContext
} from 'grommet'
import { atom, useAtom } from 'jotai'
import Skeleton from 'react-loading-skeleton'
import { ErrorFilled, Search } from '@carbon/icons-react'
import theme from '../styles/theme'
import CardNotification from './CardNotification'
import usePatients from '../hooks/patients'
import { useRouter } from 'next/router'
import { isEmpty, isEqual } from 'lodash'
import { useContext } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export type PatientsTableState = {
  step: string
  page: string
  search?: string
}

export interface UpdateQueryParams {
  page: number
  startIndex: number
  endIndex: number
  search?: string
}

const DEBOUNCE_MS: number = 500
const FALLBACK_PATIENTS_PER_PAGE: number = 20
const MAX_ALLOWABLE_PATIENT_DISPLAYED: number = 300
/**
 * imparatively define an atom
 * so that we do not loose our pagination when navigating
 * to a different page
 */
const patientsPaginationState = atom<PatientsTableState>({
  step: `${FALLBACK_PATIENTS_PER_PAGE}`,
  page: '1',
  search: ''
})

export const patientsSearchString = atom<string>('')

export default function PatientsTable() {
  const size = useContext(ResponsiveContext)
  const [pageState, updatePageState] = useAtom(patientsPaginationState)
  const [searchString, setSearchString] = useAtom(patientsSearchString)
  const router = useRouter()

  function updateQueryParams({
    page,
    startIndex,
    endIndex,
    search
  }: UpdateQueryParams) {
    const newState = {
      step: (endIndex - startIndex).toString(),
      page: page.toString(),
      search
    }
    updatePageState(newState)
    quietlySetQuery(newState)
  }

  const debounceStepSizeChange = useDebouncedCallback(
    (step: string) =>
      updateQueryParams({
        endIndex: parseInt(step),
        startIndex: 0,
        page: parseInt(router?.query?.page as string),
        search: `${router?.query.search ?? ''}`
      }),
    DEBOUNCE_MS
  )

  const debouceSearchStringChange = useDebouncedCallback((str: string) => {
    updateQueryParams({
      endIndex: parseInt(router?.query?.step as string),
      startIndex: 0,
      page: parseInt(router?.query?.page as string),
      search: str ?? ''
    })
  }, DEBOUNCE_MS * 2)

  function quietlySetQuery(state: PatientsTableState) {
    router.replace(
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
        updatePageState(router.query as PatientsTableState)
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
  } = usePatients({
    pagination: router.query,
    search: router?.query?.search as string
  })

  const step: number =
    parseInt(router?.query?.step as string) ?? FALLBACK_PATIENTS_PER_PAGE
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
      <Box>
        <TextInput
          size="small"
          placeholder="Search patients by name, email or phone number..."
          style={{
            paddingLeft: '32px',
            paddingRight: '32px',
            borderRadius: '0px'
          }}
          icon={<Search size={16} />}
          reverse
          value={searchString}
          onChange={(event) => {
            debouceSearchStringChange(event.target.value)
            setSearchString(event.target.value)
          }}
        />

        <DataTable
          sortable
          pin
          className="patients-table"
          columns={[
            {
              property: 'First Name',
              header: (
                <Box pad={{ left: 'medium' }}>
                  <Text size="small">First Name</Text>
                </Box>
              ),
              render: ({ firstName }) => (
                <Box pad={{ left: 'medium' }}>
                  <Text size="small">{firstName}</Text>
                </Box>
              )
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
              render: (user) => (
                <Box direction="column">
                  <Text size="small" color={theme.global.colors['dark-2']}>
                    <Text weight="bolder" size="small">
                      Phone:
                    </Text>{' '}
                    {user.phoneNumber ? (
                      user.phoneNumber
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
                      href={`mailto:${user.email}`}
                    >
                      {user.email}
                    </Anchor>
                  </Text>
                </Box>
              )
            },
            {
              property: 'Pickup',
              header: <Text size="small">Pickup</Text>,
              pin: shouldPinColums,
              render: ({ Patient: { pickupEnabled } }) => (
                <Box
                  round
                  background={
                    pickupEnabled
                      ? theme.global.colors['status-ok']
                      : theme.global.colors['dark-6']
                  }
                  pad="xxsmall"
                  align="center"
                  border
                >
                  <Text size="xsmall" color={theme.global.colors.white}>
                    {pickupEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </Box>
              )
            }
          ]}
          resizeable
          data={patients ?? []}
          pad="small"
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
              updateQueryParams({
                page,
                startIndex,
                endIndex,
                search: `${router.query.search}`
              })
            }
          />
        </Box>
      </Box>
    </>
  )
}
