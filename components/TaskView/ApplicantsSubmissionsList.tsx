/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import taskContractABI from '@/utils/abi/taskContractABI.json'
import {
  readContract,
  readContracts,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
} from '@wagmi/core'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  IPFSSubmition,
  TasksOverview,
  TasksPagination,
  TasksCounting,
  Application,
} from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import { File, SmileySad, Info } from 'phosphor-react'

type ApplicantsSubmissionsListProps = {
  data: Application[]
  taskId: string
  budget: string
}

// eslint-disable-next-line prettier/prettier
const ApplicantsSubmissionsList = ({data, taskId, budget}: ApplicantsSubmissionsListProps) => {
  const [filteredTasks, setFilteredTasks] = useState<TasksOverview[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [departament, setDepartament] = useState('All')
  const [orderByDeadline, setOrderByDeadline] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [finalTasks, setFinalTasks] = useState<TasksOverview[]>([])
  const [pagination, setPagination] = useState<TasksPagination>()
  const pathname = usePathname()

  const statusOptions = ['open', 'active', 'completed']
  const departamentsOptions = [
    'All',
    'Data',
    'Blockchain',
    'DevOps/Cloud',
    'Front-end',
  ]
  const orderByOptions = ['newest', 'oldest']

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  const { push } = useRouter()

  const handleDepartamentSelection = (value: string) => {
    updateUrl('departament', value)
  }
  const handleOrderByDeadlineSelection = () => {
    if (orderByDeadline === 'oldest') {
      setOrderByDeadline('newest')
      updateUrl('orderBy', 'newest')
    } else {
      setOrderByDeadline('oldest')
      updateUrl('orderBy', 'oldest')
    }
  }

  const handlePaginationSelectionNext = () => {
    updateUrl('page', String(pagination.currentPage + 1))
    scrollManually()
  }
  const handlePaginationSelectionPrev = () => {
    updateUrl('page', String(pagination.currentPage - 1))
    scrollManually()
  }

  // Função para atualizar a URL
  const updateUrl = (param: string, value: string | null) => {
    if (param !== 'page') {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
      }
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)

      if (value) {
        url.searchParams.set(param, value)
      } else {
        url.searchParams.delete(param)
      }

      window.history.pushState({}, '', url.toString())
      handleUpdate()
    }
  }

  function getStatusIndex(status: string): number {
    return statusOptions.indexOf(status)
  }

  // When I want to scroll manually to the tasks
  const scrollManually = () => {
    const taskStartElement = document.getElementById('taskStart')
    taskStartElement.scrollIntoView({ behavior: 'smooth' })
  }

  const handleUpdate = () => {
    console.log('updated url happening')
    setDepartament('All')

    let urlHasAllParamDepartament = false
    // setIsLoading(true)
    // the body that will be passed to call the getTasksFiltered() endpoint
    const dataBody = {}
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      console.log(`pegando os filtros pela window ${finalTasks}`)

      const status = url.searchParams.get('status')
      if (status) {
        // if it returns -1, it means that it was passed a value that is not in the array
        if (getStatusIndex(status) >= 0) {
          dataBody['status'] = String(getStatusIndex(status))
        }
      }

      const departament = url.searchParams.get('departament')
      if (
        departament &&
        departament !== 'All' &&
        departamentsOptions.includes(departament)
      ) {
        dataBody['departament'] = departament
        setDepartament(departament)
      }
      if (departament === 'All') {
        urlHasAllParamDepartament = true
      }

      const orderBy = url.searchParams.get('orderBy')
      console.log(orderBy)
      if (orderBy && orderByOptions.includes(orderBy)) {
        dataBody['deadlineSorting'] = orderBy
      }

      const searchBar = url.searchParams.get('searchBar')
      if (searchBar) {
        const searchPhrase = Array.isArray(searchBar) ? searchBar[0] : searchBar
        console.log('a search bar ' + searchPhrase)
        dataBody['searchBar'] = String(searchPhrase)
      }

      const pageNumber = url.searchParams.get('page')
      if (pageNumber && !isNaN(Number(pageNumber))) {
        dataBody['page'] = Number(pageNumber)
      }
    }

    if (Object.keys(dataBody).length !== 0 || urlHasAllParamDepartament) {
      const taskStartElement = document.getElementById('taskStart')
      taskStartElement.scrollIntoView({ behavior: 'smooth' })
    }

    // getTasks(dataBody)
  }

  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  function NoTasks() {
    return (
      <div className="mt-[64px] mb-[100px] flex flex-col items-center">
        <SmileySad size={32} className="text-blue-500 mb-2" />
        <span>No applications found</span>
      </div>
    )
  }

  function returnsBudget(percentage: string) {
    // eslint-disable-next-line prettier/prettier
    const amountRequested = Number((Number(budget) * Number(percentage) / 100).toFixed(2)).toLocaleString('en-US')

    return (
      <div className="font-bold !leading-[150%]">
        ${amountRequested}{' '}
        <span className="font-normal !leading-[150%]">({percentage}%)</span>
      </div>
    )
  }

  useEffect(() => {
    console.log('useEffect chamado')
    setApplications(data)
    console.log('recebi application')
    console.log(data)
    handleUpdate()
  }, [data])

  return (
    <div className="text-[16px] font-medium !leading-[19px] text-[#505050]">
      <div className="mt-[49px] w-full rounded-[10px] bg-[#F5F5F5] py-[30px] px-[15px]">
        <div className="flex justify-center">
          This project is still open for new applicants, if you are qualified
          candidate please apply now
        </div>
        <div className="flex justify-center">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/application/${taskId}`}
            className="mt-[25px] flex h-[43px] w-[135px] cursor-pointer items-center justify-center rounded-[10px] bg-[#12AD50] px-[5px] text-[16px] font-bold text-white hover:bg-[#0b9040]"
          >
            Start working
          </a>
        </div>
      </div>
      <div className="mt-[30px] pr-2 text-[#000000]">
        <div className="flex items-start justify-between rounded-[10px] border border-[#D4D4D4] bg-[#F1F0F0] px-[25px] py-[10px] text-[16px] font-bold">
          <div className="mr-4 flex w-[35%] items-center">
            <p
              onClick={() => {
                console.log('as tasks')
                console.log(finalTasks)
                console.log('filtered tasks')
                console.log(filteredTasks)
              }}
              className="pr-2"
            >
              Applicants
            </p>
          </div>
          <div className="flex w-[10%] items-center">
            <p className="pr-[15px]">Budget</p>
            <svg
              className={`w-[14px] cursor-pointer  ${
                orderByDeadline === 'oldest' ? 'rotate-180 transform' : ''
              }`}
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.15474 9.65876L0.35261 3.07599C-0.117537 2.62101 -0.117537 1.88529 0.35261 1.43514L1.48296 0.341239C1.95311 -0.113746 2.71335 -0.113746 3.17849 0.341239L8 5.00726L12.8215 0.341239C13.2917 -0.113746 14.0519 -0.113746 14.517 0.341239L15.6474 1.43514C16.1175 1.89013 16.1175 2.62585 15.6474 3.07599L8.84526 9.65876C8.38512 10.1137 7.62488 10.1137 7.15474 9.65876Z"
                fill="#959595"
              />
            </svg>
          </div>
          <div className="flex w-[15%] items-center">
            <p className="pr-2">Job Success</p>
          </div>
          <div className="flex w-[15%] items-center">
            <p className="pr-2">Total Earned</p>
          </div>
          <div className="flex w-[8%] items-center">
            <p className="pr-[15px]">Joined</p>
            <svg
              onClick={handleOrderByDeadlineSelection}
              className={`w-[14px] cursor-pointer  ${
                orderByDeadline === 'oldest' ? 'rotate-180 transform' : ''
              }`}
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.15474 9.65876L0.35261 3.07599C-0.117537 2.62101 -0.117537 1.88529 0.35261 1.43514L1.48296 0.341239C1.95311 -0.113746 2.71335 -0.113746 3.17849 0.341239L8 5.00726L12.8215 0.341239C13.2917 -0.113746 14.0519 -0.113746 14.517 0.341239L15.6474 1.43514C16.1175 1.89013 16.1175 2.62585 15.6474 3.07599L8.84526 9.65876C8.38512 10.1137 7.62488 10.1137 7.15474 9.65876Z"
                fill="#959595"
              />
            </svg>
          </div>
          <div className="w-[12%]"></div>
        </div>
        {isLoading && (
          <div className="mt-[34px]">
            <div className="flex h-32 animate-pulse pb-12">
              <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
              <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
            </div>
            <div className="flex h-32 animate-pulse pb-12">
              <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
              <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
            </div>
            <div className="flex h-32 animate-pulse pb-12">
              <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
              <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
            </div>
          </div>
        )}
        {!isLoading && applications.length === 0 && <NoTasks />}
        {!isLoading &&
          applications.length > 0 &&
          applications.map((application, index) => (
            <div key={index}>
              <div
                className={`relative mr-1 ${
                  index === 0 ? 'mt-[34px]' : 'mt-[25px]'
                } flex items-start justify-between border-b border-[#D4D4D4] pb-6 text-[16px] font-normal text-[#000000]`}
              >
                <div className="mr-4 w-[35%] items-center">
                  <div className="flex">
                  <div>
                      <img
                        alt="ethereum avatar"
                        src={`https://effigy.im/a/${application.applicant}.svg`}
                        className="mr-[10px] w-[50px] rounded-full"
                      ></img>
                    </div>
                    <div>
                      <p
                        title={
                          application.metadataDisplayName ||
                          application.applicant
                        }
                        className="overflow-hidden text-ellipsis whitespace-nowrap pb-2 font-bold text-[#0354EC]"
                      >
                        {application.metadataDisplayName ||
                          formatAddress(application.applicant)}
                      </p>
                      <a
                        title={formatAddress(application.applicant)}
                        className="mt-[8px] cursor-pointer text-[14px] font-normal text-[#505050] hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://polygonscan.com/address/${application.applicant}`}
                      >
                        {formatAddress(application.applicant)}
                      </a>
                    </div>
                  </div>
                  <div
                    title={application.metadataDescription}
                    className="mt-[13px] text-[14px] font-normal !leading-[150%] line-clamp-2"
                  >
                    {application.metadataDescription}
                  </div>
                </div>
                <div className="flex w-[15%] items-center">
                  <p className="max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {returnsBudget(application.metadataProposedBudget)}
                  </p>
                </div>
                <div className=" flex w-[10%] items-center">
                  {/* {task.estimatedBudget && (
                    <div className="flex">
                      <p key={index}>$</p>
                      <p
                        title={Number(task.estimatedBudget).toLocaleString(
                          'en-US',
                        )}
                        className="mr-1 max-w-[60%] overflow-hidden text-ellipsis whitespace-nowrap"
                        key={index}
                      >
                        {Number(task.estimatedBudget).toLocaleString('en-US')}
                      </p>
                      <p>{`(`}</p>
                      <img
                        src="/images/tokens/usd-coin-usdc-logo.svg"
                        alt="image"
                        className={`w-[14px]`}
                      />
                      <p>{`)`}</p>
                    </div>
                  )} */}
                </div>
                {/* <div className="flex w-[8%] items-center">{task.daysLeft}</div> */}
                <div className="flex w-[12%]">
                  <a
                    // href={`/task/${task.id}`}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="ml-auto cursor-pointer rounded-md border border-[#0354EC] bg-white py-1 px-4 text-[#0354EC] hover:bg-[#0354EC] hover:text-white"
                  >
                    View more
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ApplicantsSubmissionsList
