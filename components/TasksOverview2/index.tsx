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
import { IPFSSubmition, TasksOverview } from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import HeroTasks from './HeroTasks'
import { File, SmileySad, Info } from 'phosphor-react'

const TransactionList = () => {
  const [filteredTasks, setFilteredTasks] = useState<TasksOverview[]>([])
  const [departament, setDepartament] = useState('All')
  const [orderByDeadline, setOrderByDeadline] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [finalTasks, setFinalTasks] = useState<TasksOverview[]>([])
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition[] | undefined>(
    [],
  )
  const [taskChainData, setTaskChainData] = useState<any[]>([])
  const pathname = usePathname()

  const statusOptions = ['open', 'active', 'completed']
  const departamentsOptions = ['All', 'Data', 'Blockchain', 'Cloud', 'Frontend']
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

  // Função para atualizar a URL
  const updateUrl = (param: string, value: string | null) => {
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

  const handleUpdate = () => {
    console.log('updated url happening')

    setDepartament('All')
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
    }

    getTasks(dataBody)
  }

  async function getTasks(dataBody: any) {
    const config = {
      method: 'post' as 'post',
      url: `https://dpl-backend-homolog.up.railway.app/functions/getTasks`,
      headers: {
        'x-parse-application-id':
          'as90qw90uj3j9201fj90fj90dwinmfwei98f98ew0-o0c1m221dds222143',
      },
      data: dataBody,
    }

    let dado
    try {
      await axios(config).then(function (response) {
        if (response.data) {
          setFinalTasks(response.data)
        }
      })
    } catch (err) {
      console.log('erro na setagem de tasks')
      console.log(err)
    }

    setIsLoading(false)
  }

  function countStatusTasks(status: string) {
    const tasksWithStatus = finalTasks.filter((task) => task.status === status)
    return tasksWithStatus.length
  }

  function NoTasks() {
    return (
      <div className="mt-4 mb-4 flex flex-col items-center">
        <SmileySad size={32} className="text-blue-500 mb-2" />
        <span>No tasks found</span>
      </div>
    )
  }

  useEffect(() => {
    console.log('useEffect chamado')
    getTasks({})
    handleUpdate()
  }, [pathname])

  useEffect(() => {
    console.log('task altearada, chamando novo handle')
    console.log(`a task nova: ${finalTasks}`)
    handleUpdate()
  }, [finalTasks])

  if (isLoading) {
    return (
      <section className="py-16 px-32 text-black md:py-20 lg:pt-40">
        <div className="container flex h-60 animate-pulse pb-12">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="container h-96 animate-pulse bg-[#dfdfdf] pb-12"></div>
      </section>
    )
  }

  return (
    <>
      <HeroTasks />
      <SearchModal
        onUpdate={handleUpdate}
        openProjectsNumber={countStatusTasks('open')}
        activeProjectsNumber={countStatusTasks('active')}
        completedProjectsNumber={countStatusTasks('completed')}
      />
      <section className="py-16 px-32 text-black md:py-20 lg:pt-32">
        <div className="container">
          <div className="pr-2 text-[#000000]">
            <div className="mb-14 flex items-start justify-between text-[18px] font-bold">
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
                  Project
                </p>
              </div>
              <div className="flex w-[15%] items-center">
                <p className="pr-2">Dept/Tags</p>
              </div>
              <div className="flex w-[10%] items-center">
                <p className="pr-2">Budget</p>
                <img
                  src="/images/task/vectorDown.svg"
                  alt="image"
                  className={`w-[14px]`}
                />
              </div>
              <div className="flex w-[8%] items-center">
                <p className="pr-2">Ends</p>
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
            {finalTasks.length === 0 && <NoTasks />}
            {finalTasks.length > 0 &&
              finalTasks.map((task) => (
                <TasksModal key={task.id} task={task} isLoading={false} />
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default TransactionList
