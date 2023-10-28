/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import TasksModal from './TasksModal'
import SearchModal from './SearchModal'
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
} from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import HeroTasks from './HeroTasks'
import { File, SmileySad, Info } from 'phosphor-react'
import SidebarNav from '../SidebarNav'
import ReducedSidebarNav from '../ReducedSideBarNav'

const TransactionList = () => {
  const [filteredTasks, setFilteredTasks] = useState<TasksOverview[]>([])
  const [departament, setDepartament] = useState('All')
  const [orderByDeadline, setOrderByDeadline] = useState('')
  const [orderByEstimatedBudget, setOrderByEstimatedBudget] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [finalTasks, setFinalTasks] = useState<TasksOverview[]>([])
  const [pagination, setPagination] = useState<TasksPagination>()
  const [counting, setCounting] = useState<TasksCounting>()
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition[] | undefined>(
    [],
  )
  const [taskChainData, setTaskChainData] = useState<any[]>([])
  const pathname = usePathname()

  const statusOptions = ['open', 'active', 'completed', 'draft']
  const departamentsOptions = [
    'All',
    'Data',
    'Blockchain',
    'DevOps',
    'Cloud',
    'Docs',
    'Infrastructure',
    'Integrations',
    'Web App Development',
    'Analytics',
    'Data',
    'Front-end',
  ]
  const orderByOptions = ['newest', 'oldest']
  const budgetOrderByOptions = ['greater', 'lesser']
  const [isSidebarExpanded, setSidebarExpanded] = useState(false)

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  const { push } = useRouter()

  const handleDepartamentSelection = (value: string) => {
    updateUrl('departament', value)
  }
  const handleOrderByDeadlineSelection = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('budgetOrderBy')
      window.history.pushState({}, '', url.toString())
    }
    if (orderByDeadline === 'oldest') {
      setOrderByDeadline('newest')
      updateUrl('orderBy', 'newest')
    } else {
      setOrderByDeadline('oldest')
      updateUrl('orderBy', 'oldest')
    }
  }

  const handleOrderByEstimatedBudgetSelection = () => {
    if (typeof window !== 'undefined') {
      console.log('window is undefined tn')
      const url = new URL(window.location.href)
      url.searchParams.delete('orderBy')
      window.history.pushState({}, '', url.toString())
    }
    if (orderByEstimatedBudget === 'greater') {
      setOrderByEstimatedBudget('lesser')
      updateUrl('budgetOrderBy', 'lesser')
    } else {
      setOrderByEstimatedBudget('greater')
      updateUrl('budgetOrderBy', 'greater')
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
        setOrderByDeadline(orderBy)
      }

      const budgetOrderBy = url.searchParams.get('budgetOrderBy')
      console.log(budgetOrderBy)
      if (budgetOrderBy && budgetOrderByOptions.includes(budgetOrderBy)) {
        dataBody['estimatedBudgetSorting'] = budgetOrderBy
        // cannot have two ordersby - so estimatedBudgetSorting has priority over deadlineSorting
        setOrderByDeadline('')
        setOrderByEstimatedBudget(budgetOrderBy)
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

    getTasks(dataBody)
  }

  async function getTasks(dataBody: any) {
    setIsLoading(true)
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/functions/getTasks`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      },
      data: dataBody,
    }

    let dado
    try {
      await axios(config).then(function (response) {
        console.log('as respostas das taskss')
        console.log(response.data)
        if (response.data) {
          setFinalTasks(response.data.tasks)
          setPagination(response.data.pagination)
          setCounting(response.data.counting)
        }
      })
    } catch (err) {
      console.log('erro na setagem de tasks')
      console.log(err)
    }

    setIsLoading(false)
  }

  function NoTasks() {
    return (
      <div className="mt-[64px] mb-[100px] flex flex-col items-center">
        <SmileySad size={32} className="text-blue-500 mb-2" />
        <span>No tasks found</span>
      </div>
    )
  }

  useEffect(() => {
    console.log('useEffect chamado')
    handleUpdate()
  }, [pathname])

  return (
    <>
      <div className="flex">
        <div className="md:hidden">
          <div
            className={`opacity-${
              isSidebarExpanded ? '100 block h-full' : '0 hidden'
            } h-full transition-opacity duration-300`}
          >
            <SidebarNav
              onUpdate={handleUpdate}
              onClickBurger={() => setSidebarExpanded(!isSidebarExpanded)}
              scrollManually={scrollManually}
              openProjectsNumber={counting ? counting.open : 0}
              activeProjectsNumber={counting ? counting.active : 0}
              completedProjectsNumber={counting ? counting.completed : 0}
              draftProjectsNumber={counting ? counting.draft : 0}
            />
          </div>
          <div
            className={`opacity-${
              isSidebarExpanded ? '0 hidden' : '100 block'
            } h-full transition-opacity duration-300`}
          >
            <ReducedSidebarNav
              onUpdate={handleUpdate}
              onClickBurger={() => setSidebarExpanded(!isSidebarExpanded)}
              scrollManually={scrollManually}
              openProjectsNumber={counting ? counting.open : 0}
              activeProjectsNumber={counting ? counting.active : 0}
              completedProjectsNumber={counting ? counting.completed : 0}
              draftProjectsNumber={counting ? counting.draft : 0}
            />
          </div>
        </div>
        <div
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          className="hidden md:block"
        >
          <div
            className={`opacity-${
              isSidebarExpanded ? '100 block h-full' : '0 hidden'
            } h-full transition-opacity duration-300`}
          >
            <SidebarNav
              onUpdate={handleUpdate}
              onClickBurger={() => console.log()}
              scrollManually={scrollManually}
              openProjectsNumber={counting ? counting.open : 0}
              activeProjectsNumber={counting ? counting.active : 0}
              completedProjectsNumber={counting ? counting.completed : 0}
              draftProjectsNumber={counting ? counting.draft : 0}
            />
          </div>
          <div
            className={`opacity-${
              isSidebarExpanded ? '0 hidden' : '100 block'
            } h-full transition-opacity duration-300`}
          >
            <ReducedSidebarNav
              onUpdate={handleUpdate}
              onClickBurger={() => console.log()}
              scrollManually={scrollManually}
              openProjectsNumber={counting ? counting.open : 0}
              activeProjectsNumber={counting ? counting.active : 0}
              completedProjectsNumber={counting ? counting.completed : 0}
              draftProjectsNumber={counting ? counting.draft : 0}
            />
          </div>
        </div>
        <div className="mx-auto px-[17px] md:px-[20.6px] lg:px-[23.8px] xl:px-[27px] 2xl:px-[34px]">
          <SearchModal
            onUpdate={handleUpdate}
            scrollManually={scrollManually}
            openProjectsNumber={counting ? counting.open : 0}
            activeProjectsNumber={counting ? counting.active : 0}
            completedProjectsNumber={counting ? counting.completed : 0}
            draftProjectsNumber={counting ? counting.draft : 0}
          />
          <section
            className="mt-[27px] md:mt-[33px] lg:mt-[38.5px] xl:mt-[44px] 2xl:mt-[55px]"
            id={'taskStart'}
          >
            <div
              className={`container ${
                isSidebarExpanded ? 'max-w-[150px]' : 'max-w-[200px]'
              } px-0 md:max-w-none 2xl:max-w-[1800px]`}
            >
              <div className=" text-[#000000]">
                <div className="flex items-start justify-between overflow-x-auto rounded-[10px] border-[0.7px] border-[#E3E3E3] bg-[#fff] px-[25px] py-[10px] text-[12px] font-medium lg:text-[16px]">
                  <div className="mr-4 flex w-[100px] items-center lg:w-[35%]">
                    <p
                      onClick={() => {
                        console.log('as tasks')
                        console.log(finalTasks)
                        console.log('filtered tasks')
                        console.log(filteredTasks)
                      }}
                      className="pr-[55px] lg:pr-2"
                    >
                      Project
                    </p>
                  </div>
                  <div className="flex w-[100px] items-center lg:w-[15%]">
                    <p className="pr-[20px] lg:pr-2">Dept/Tags</p>
                  </div>
                  <div className="flex w-[100px] items-center lg:w-[10%]">
                    <p className="pr-[10px] lg:pr-[15px]">Budget</p>
                    {/* <img
                  src="/images/task/vectorDown.svg"
                  alt="image"
                  className={`w-[14px]`}
                /> */}
                    <svg
                      width="11"
                      onClick={handleOrderByEstimatedBudgetSelection}
                      className={`w-[10px] cursor-pointer lg:w-[14px]  ${
                        orderByEstimatedBudget === 'greater'
                          ? 'rotate-180 transform'
                          : ''
                      }`}
                      height="7"
                      viewBox="0 0 11 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="0.336336"
                        y1="1.08462"
                        x2="5.33634"
                        y2="5.63007"
                        stroke="black"
                      />
                      <line
                        x1="10.3536"
                        y1="1.35355"
                        x2="5.35355"
                        y2="6.35355"
                        stroke="black"
                      />
                    </svg>
                  </div>
                  <div className="flex w-[100px] items-center lg:w-[8%]">
                    <p className="pr-[10px] pl-[20px] lg:pr-[15px]">Ends</p>
                    <svg
                      onClick={handleOrderByDeadlineSelection}
                      className={`w-[10px] cursor-pointer lg:w-[14px]  ${
                        orderByDeadline === 'oldest'
                          ? 'rotate-180 transform'
                          : ''
                      }`}
                      viewBox="0 0 11 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="0.336336"
                        y1="1.08462"
                        x2="5.33634"
                        y2="5.63007"
                        stroke="black"
                      />
                      <line
                        x1="10.3536"
                        y1="1.35355"
                        x2="5.35355"
                        y2="6.35355"
                        stroke="black"
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
                {!isLoading && finalTasks.length === 0 && <NoTasks />}
                <div className="overflow-x-auto">
                  {!isLoading &&
                    finalTasks.length > 0 &&
                    finalTasks.map((task, index) => (
                      <TasksModal
                        key={task.id}
                        index={index}
                        task={task}
                        isLoading={false}
                      />
                    ))}
                </div>
                {!isLoading && finalTasks.length > 0 && pagination && (
                  <div className="flex items-center justify-center pt-16 pb-[40px] text-[14px] font-normal md:pb-[180px] lg:text-[18px]">
                    {pagination.currentPage !== 1 && (
                      <p
                        onClick={handlePaginationSelectionPrev}
                        className="cursor-pointer hover:text-[#1068E6]"
                      >
                        Prev
                      </p>
                    )}
                    <p className="mx-2 md:mx-14">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    {pagination.totalPages > pagination.currentPage && (
                      <p
                        onClick={handlePaginationSelectionNext}
                        className="cursor-pointer hover:text-[#1068E6]"
                      >
                        Next
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default TransactionList
