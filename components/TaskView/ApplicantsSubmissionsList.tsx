/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
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
  Submission,
} from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import { File, SmileySad, Info } from 'phosphor-react'

type ApplicantsSubmissionsListProps = {
  dataApplication: Application[]
  dataSubmission: Submission[]
  taskId: string
  budget: string
  isOpen: boolean
  address: string
  taskExecutor: string
}

// eslint-disable-next-line prettier/prettier
const ApplicantsSubmissionsList = ({dataApplication, dataSubmission, taskId, budget, isOpen, address, taskExecutor}: ApplicantsSubmissionsListProps) => {
  const [filteredTasks, setFilteredTasks] = useState<TasksOverview[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [departament, setDepartament] = useState('All')
  const [orderByTimestamp, setOrderByTimestamp] = useState('oldest')
  const [orderByBudget, setOrderByBudget] = useState('greater')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isNominationLoading, setIsNominationLoading] = useState<boolean>(false)
  const [isTakingTaskLoading, setIsTakingTaskLoading] = useState<boolean>(false)

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
  const handleOrderByTimestampSelection = () => {
    let sortedApplications

    if (orderByTimestamp === 'oldest') {
      setOrderByTimestamp('newest')
      // do here the sorting to show the most recent timestamps first
      sortedApplications = [...applications].sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp),
      )
    } else {
      setOrderByTimestamp('oldest')
      // do here the sorting to show the oldest timestamps first
      sortedApplications = [...applications].sort(
        (a, b) => Number(a.timestamp) - Number(b.timestamp),
      )
    }

    setApplications(sortedApplications)
  }

  const handleOrderByBudgetSelection = () => {
    let sortedApplications

    if (orderByBudget === 'greater') {
      setOrderByBudget('lesser')
      // do here the sorting to show the cheaper budgets first
      sortedApplications = [...applications].sort(
        (a, b) =>
          Number(a.metadataProposedBudget) - Number(b.metadataProposedBudget),
      )
    } else {
      setOrderByBudget('greater')
      // do here the sorting to show the more expensive budgets first
      sortedApplications = [...applications].sort(
        (a, b) =>
          Number(b.metadataProposedBudget) - Number(a.metadataProposedBudget),
      )
    }

    setApplications(sortedApplications)
  }

  const handlePaginationSelectionNext = () => {
    updateUrl('page', String(pagination.currentPage + 1))
    scrollManually()
  }
  const handlePaginationSelectionPrev = () => {
    updateUrl('page', String(pagination.currentPage - 1))
    scrollManually()
  }

  function formatDeadline(timestamp) {
    const date = new Date(Number(timestamp) * 1000)
    let difference = formatDistanceToNow(date)

    // Aqui estamos tratando a frase para exibir 'today' se a task foi criada no mesmo dia
    difference = `${difference.charAt(0).toUpperCase()}${difference.slice(
      1,
    )} ago`
    return difference
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

  async function handleCreateNomination(taskId: string, applicationId: string) {
    console.log('value to be sent')
    const { request } = await prepareWriteContract({
      address: `0x${taskAddress.substring(2)}`,
      abi: taskContractABI,
      args: [Number(taskId), [Number(applicationId)]],
      functionName: 'acceptApplications',
    })
    const { hash } = await writeContract(request)

    const data = await waitForTransaction({
      hash,
    })
    console.log('the data')
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 5500))
    if (data.status !== 'success') {
      throw data
    }
  }

  async function handleCreateTakingTask(taskId: string, applicationId: string) {
    console.log('value to be sent')
    const { request } = await prepareWriteContract({
      address: `0x${taskAddress.substring(2)}`,
      abi: taskContractABI,
      args: [Number(taskId), [Number(applicationId)]],
      functionName: 'takeTask',
    })
    const { hash } = await writeContract(request)

    const data = await waitForTransaction({
      hash,
    })
    console.log('the data')
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 5500))
    if (data.status !== 'success') {
      throw data
    }
  }

  async function handleNominate(applicationIdValue: string) {
    setIsNominationLoading(true)
    console.log('doing nomination')
    try {
      await handleCreateNomination(taskId, applicationIdValue)
      window.location.reload()
      toast.success('Nomination done succesfully!')
      setIsNominationLoading(false)
    } catch (err) {
      toast.error('Error during the application nomination')
      console.log(err)
      setIsNominationLoading(false)
    }
  }

  async function handleTakeTask(applicationIdValue: string) {
    setIsTakingTaskLoading(true)
    console.log('doing taking')
    try {
      await handleCreateTakingTask(taskId, applicationIdValue)
      window.location.reload()
      toast.success('Task took succesfully!')
      setIsTakingTaskLoading(false)
    } catch (err) {
      toast.error('Error during the task taking')
      console.log(err)
      setIsTakingTaskLoading(false)
    }
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

  function NoApplications() {
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
    setApplications(dataApplication)
    setSubmissions(dataSubmission)
    console.log('recebi application')
    console.log(dataApplication)
    console.log('recebi submission')
    console.log(dataSubmission)
    handleUpdate()
  }, [dataApplication])

  return (
    <div className="text-[16px] font-medium !leading-[19px] text-[#505050]">
      {isOpen && (
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
      )}
      <div className={`text-[#000000] ${isOpen ? 'mt-[30px]' : 'mt-[49px]'}`}>
        <div className="flex items-center rounded-[10px] border border-[#D4D4D4] bg-[#F1F0F0] py-[11.5px] text-[16px] font-bold !leading-[150%]">
          <div className="mr-[52px] flex w-[400px] pl-[25px]">
            <p className="mr-[10px]">Applicants</p>
            <svg
              onClick={handleOrderByBudgetSelection}
              className={`w-[14px] cursor-pointer  ${
                orderByBudget === 'lesser' ? 'rotate-180 transform' : ''
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
          <div className="mr-[52px] flex pl-[44px]">
            <p className="mr-[10px]">Budget</p>
            <svg
              onClick={handleOrderByBudgetSelection}
              className={`w-[14px] cursor-pointer  ${
                orderByBudget === 'lesser' ? 'rotate-180 transform' : ''
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
          <div className="mr-[52px] flex">
            <p className="mr-[10px]">Job Success</p>
            <svg
              className={`w-[14px] cursor-pointer`}
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
          <div className="mr-[52px] flex pl-[29px]">
            <p className="mr-[10px]">Total Earned</p>
            <svg
              className={`w-[14px] cursor-pointer`}
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
          <div className="mr-[177px] flex pl-[47px]">
            <p className="mr-[10px]">Joined</p>
            <svg
              onClick={handleOrderByTimestampSelection}
              className={`w-[14px] cursor-pointer  ${
                orderByTimestamp === 'newest' ? 'rotate-180 transform' : ''
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
        {!isLoading && applications.length === 0 && <NoApplications />}
        {!isLoading &&
          applications.length > 0 &&
          applications.map((application, index) => (
            <div key={index}>
              <div
                className={`relative mr-1 ${
                  index === 0 ? 'mt-[34px]' : 'mt-[25px]'
                } flex items-start justify-between border-b border-[#D4D4D4] pb-6 text-[16px] font-normal text-[#000000]`}
              >
                <div className="mr-[52px] w-[400px] items-center">
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
                        className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap pb-2 font-bold text-[#0354EC]"
                      >
                        {application.metadataDisplayName ||
                          formatAddress(application.applicant)}
                      </p>
                      <a
                        title={formatAddress(application.applicant)}
                        className="mt-[8px] cursor-pointer text-[14px] font-normal text-[#505050] hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://mumbai.polygonscan.com/address/${application.applicant}`}
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
                <div className="mr-[52px] flex w-[125px] items-center pl-[5px]">
                  <p className="max-w-[120%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {returnsBudget(application.metadataProposedBudget)}
                  </p>
                </div>
                <div className="mr-[52px] flex w-[55px] items-center">
                  <p>{application.jobSuccess || 'Undefined'}</p>
                </div>
                <div className="mr-[52px] flex w-[55px] items-center">
                  <p>{application.jobSuccess || 'Undefined'}</p>
                </div>
                <div className="mr-[52px] flex w-[225px] items-center justify-center">
                  {formatDeadline(application.timestamp)}
                </div>
                <div>
                  <div className="flex">
                    <a
                      // href={`/task/${task.id}`}
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="ml-auto flex w-[125px] cursor-pointer justify-center rounded-[5px] border border-[#0354EC] bg-white py-[10px] text-[16px] font-normal text-[#0354EC] hover:bg-[#0354EC] hover:text-white"
                    >
                      View more
                    </a>
                  </div>
                  {isOpen &&
                    !application.accepted &&
                    taskExecutor === address && (
                      <div className="mt-[11px] flex">
                        <a
                          // href={`/task/${task.id}`}
                          onClick={() => {
                            if (!isNominationLoading) {
                              handleNominate(application.applicationId)
                            }
                          }}
                          className={`ml-auto flex w-[125px] cursor-pointer justify-center rounded-[5px]   py-[10px] text-[16px] font-bold text-[#fff]  ${
                            isNominationLoading
                              ? 'bg-[#2f71ec]'
                              : 'bg-[#0354EC] hover:bg-[#092353]'
                          }`}
                        >
                          Nominate
                        </a>
                      </div>
                    )}
                  {isOpen &&
                    application.accepted &&
                    application.applicant === address && (
                      <div className="mt-[11px] flex">
                        <a
                          // href={`/task/${task.id}`}
                          onClick={() => {
                            if (!isTakingTaskLoading) {
                              handleTakeTask(application.applicationId)
                            }
                          }}
                          className={`ml-auto flex w-[125px] cursor-pointer justify-center rounded-[5px]   py-[10px] text-[16px] font-bold text-[#fff]  ${
                            isTakingTaskLoading
                              ? 'bg-[#2f71ec]'
                              : 'bg-[#0354EC] hover:bg-[#092353]'
                          }`}
                        >
                          Take task
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {!isLoading &&
        submissions.length > 0 &&
        submissions.map((submission, index) => (
          <div key={index} className={` text-[#000000]`}>
            {index === 0 && (
              <div className=" mt-[100px] flex items-center rounded-[10px] border border-[#D4D4D4] bg-[#F1F0F0] py-[11.5px] text-[16px] font-bold !leading-[150%]">
                <div className="mr-[52px] flex w-[400px] pl-[25px]">
                  <p className="mr-[10px]">Submissions</p>
                  <svg
                    onClick={handleOrderByBudgetSelection}
                    className={`w-[14px] cursor-pointer  ${
                      orderByBudget === 'lesser' ? 'rotate-180 transform' : ''
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
                <div className="mr-[52px] flex w-[500px] pl-[44px]">
                  <p className="mr-[10px]">Links</p>
                  <svg
                    onClick={handleOrderByBudgetSelection}
                    className={`w-[14px] cursor-pointer  ${
                      orderByBudget === 'lesser' ? 'rotate-180 transform' : ''
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
                <div className="mr-[177px] flex pl-[47px]">
                  <p className="mr-[10px]">Created</p>
                  <svg
                    onClick={handleOrderByTimestampSelection}
                    className={`w-[14px] cursor-pointer  ${
                      orderByTimestamp === 'newest'
                        ? 'rotate-180 transform'
                        : ''
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
              </div>
            )}
            <div key={index}>
              <div
                className={`relative mr-1 ${
                  index === 0 ? 'mt-[34px]' : 'mt-[25px]'
                } flex items-start justify-between border-b border-[#D4D4D4] pb-6 text-[16px] font-normal text-[#000000]`}
              >
                <div className="mr-[52px] w-[400px] items-center">
                  <div className="flex">
                    <div>
                      <img
                        alt="ethereum avatar"
                        src={`https://effigy.im/a/${submission.applicant}.svg`}
                        className="mr-[10px] w-[50px] rounded-full"
                      ></img>
                    </div>
                    <div>
                      <p
                        title={submission.applicant}
                        className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap pb-2 font-bold text-[#0354EC]"
                      >
                        {submission.applicant}
                      </p>
                      <a
                        title={formatAddress(submission.applicant)}
                        className="mt-[8px] cursor-pointer text-[14px] font-normal text-[#505050] hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://mumbai.polygonscan.com/address/${submission.applicant}`}
                      >
                        {formatAddress(submission.applicant)}
                      </a>
                    </div>
                  </div>
                  <div
                    title={submission.metadataDescription}
                    className="mt-[13px] text-[14px] font-normal !leading-[150%] line-clamp-2"
                  >
                    {submission.metadataDescription}
                  </div>
                </div>
                <div className="mr-[52px] flex w-[425px] items-center">
                  <p className="max-w-[220%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {submission.metadataAdditionalLinks}
                  </p>
                </div>
                <div className="mr-[52px] flex w-[225px] items-center justify-center">
                  {formatDeadline(submission.timestamp)}
                </div>
                <div>
                  <div className="flex">
                    <a
                      // href={`/task/${task.id}`}
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="ml-auto flex w-[125px] cursor-pointer justify-center rounded-[5px] border border-[#0354EC] bg-white py-[10px] text-[16px] font-normal text-[#0354EC] hover:bg-[#0354EC] hover:text-white"
                    >
                      View more
                    </a>
                  </div>
                  {isOpen &&
                    !submission.accepted &&
                    taskExecutor === address && (
                      <div className="mt-[11px] flex">
                        <a
                          // href={`/task/${task.id}`}
                          onClick={() => {
                            if (!isNominationLoading) {
                              handleNominate(submission.submissionId)
                            }
                          }}
                          className={`ml-auto flex w-[125px] cursor-pointer justify-center rounded-[5px]   py-[10px] text-[16px] font-bold text-[#fff]  ${
                            isNominationLoading
                              ? 'bg-[#2f71ec]'
                              : 'bg-[#0354EC] hover:bg-[#092353]'
                          }`}
                        >
                          Nominate
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default ApplicantsSubmissionsList
