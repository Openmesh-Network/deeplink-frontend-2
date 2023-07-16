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
  writeContract,
  prepareWriteContract,
  waitForTransaction,
} from '@wagmi/core'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IPFSSubmition } from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import HeroTasks from './HeroTasks'

interface TasksModalProps {
  id: number
  name: string
  description: string
  submitter: string
  deadline: string
  budget: string[]
  status: string
  logo: string
  categories: string[]
}

const TransactionList = () => {
  const [filteredTasks, setFilteredTasks] = useState<TasksModalProps[]>([])
  const [departament, setDepartament] = useState('All')
  const [orderByDeadline, setOrderByDeadline] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition[] | undefined>(
    [],
  )
  const [taskChainData, setTaskChainData] = useState<any[]>([])
  const pathname = usePathname()

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  const { push } = useRouter()

  const tasks = [
    {
      id: 0,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Trading research',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Ai', 'Blockchain', 'Science'],
      departament: 'Data',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '1689813076',
      status: 'open',
      budget: ['250'],
    },
    {
      id: 1,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Web development',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Ai', 'Blockchain'],
      departament: 'Frontend',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '1699926076',
      status: 'active',
      budget: ['550'],
    },
    {
      id: 1,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'AWS config',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['EC2'],
      departament: 'Cloud',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '1689926076',
      status: 'completed',
      budget: ['1550'],
    },
    {
      id: 1,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'NFT development',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Solidity'],
      departament: 'Blockchain',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '1690926076',
      status: 'open',
      budget: ['2550'],
    },
  ]

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

  const handleUpdate = () => {
    console.log('updated url happening')
    const filterTasks = () => {
      setFilteredTasks(tasks)
      setDepartament('All')
      // setIsLoading(true)
      let newFilteredTasks = tasks
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)

        const status = url.searchParams.get('status')
        if (status) {
          newFilteredTasks = newFilteredTasks.filter(
            (task) => task.status === status,
          )
        }

        const departament = url.searchParams.get('departament')
        if (departament && departament !== 'All') {
          const departamentValue = Array.isArray(departament)
            ? departament[0]
            : departament
          newFilteredTasks = newFilteredTasks.filter((task) =>
            task.departament.includes(departamentValue),
          )
          setDepartament(departament)
        }

        const orderBy = url.searchParams.get('orderBy')
        console.log(orderBy)
        if (orderBy) {
          if (orderBy === 'newest') {
            console.log('entrei pro newest')
            newFilteredTasks.sort(
              (a, b) => parseInt(a.deadline) - parseInt(b.deadline),
            )
            console.log(' a resposta apos')
            console.log(newFilteredTasks)
          } else if (orderBy === 'oldest') {
            console.log('entrei pro oldest')
            newFilteredTasks.sort(
              (a, b) => parseInt(b.deadline) - parseInt(a.deadline),
            )
            console.log(' a resposta apos')
            console.log(newFilteredTasks)
          }
        }

        // const searchBar = url.searchParams.get('searchBar')
        // if (searchBar) {
        //   const searchPhrase = Array.isArray(searchBar)
        //     ? searchBar[0]
        //     : searchBar // se searchBar for array, usamos o primeiro elemento
        //   console.log('a search bar' + searchPhrase)
        //   newFilteredTasks = newFilteredTasks.filter((task) =>
        //     task.name.toLowerCase().includes(searchPhrase),
        //   )
        //   console.log('filtro realizado')
        // }
        setFilteredTasks(newFilteredTasks)
        console.log('as new filtered task')
        console.log(newFilteredTasks)
      }
    }
    setIsLoading(false)
    // getTasks()
    filterTasks()
  }

  async function getTasks() {
    console.log('getting task count')
    const data = await readContract({
      address: `0x${taskAddress.substring(2)}`,
      abi: taskContractABI,
      functionName: 'taskCount',
    })
    if (!data) {
      toast.error(
        'Something occurred while fetching data from the smart-contract!',
      )
      await new Promise((resolve) => setTimeout(resolve, 1000))
      push('/')
    }

    // looping through all tasks to get the info
    for (let i = 0; i < Number(data); i++) {
      await getTaskFromChain(i)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('all the result')
    console.log(taskChainData)
    console.log(taskMetadata)
    setIsLoading(false)
  }
  async function getTaskFromChain(id: any) {
    const data = await readContract({
      address: `0x${taskAddress.substring(2)}`,
      abi: taskContractABI,
      args: [Number(id)],
      functionName: 'getTask',
    })
    if (data) {
      console.log(`the chaind data`)
      console.log(data)
      await setTaskChainData((prevState) => [...prevState, data])
      await getDataFromIPFS(data['metadata'])
    }
  }

  async function getDataFromIPFS(hash: string) {
    const url = `https://cloudflare-ipfs.com/ipfs/${hash}`

    await axios
      .get(url)
      .then(async (response) => {
        console.log('the metadata:')
        console.log(response.data)
        const payments = await getDecimalsFromPaymentsToken(
          response.data.payments,
        )
        response.data.payments = payments
        console.log(`the metadata data`)
        console.log(response.data)
        setTaskMetadata((prevState) => [...prevState, response.data])
      })
      .catch(async (err) => {
        console.log(err)
      })
  }

  function truncateHash(hash) {
    const start = hash.slice(0, 5)
    const end = hash.slice(-5)
    return `${start}...${end}`
  }

  async function getDecimalsFromPaymentsToken(payments) {
    console.log('getting decimals')
    console.log(payments)
    const newPayments = [...payments] // creating a copy of the payments
    for (let i = 0; i < payments.length; i++) {
      const data = await readContract({
        address: `0x${payments[i].tokenContract.substring(2)}`,
        abi: erc20ContractABI,
        functionName: 'decimals',
      })
      console.log('the decimal from token:')
      console.log(data)
      if (data) {
        newPayments[i].decimals = Number(data) // modifying the copy
      }
    }
    // returning the state with the correctly decimals
    return newPayments
  }

  useEffect(() => {
    handleUpdate()
  }, [pathname])

  async function logData() {
    console.log(taskChainData)
    console.log(taskMetadata)
  }

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
      <SearchModal onUpdate={handleUpdate} />
      <section className="py-16 px-32 text-black md:py-20 lg:pt-32">
        <div className="container">
          <div className="pr-2 text-[#000000]">
            <div className="mb-14 flex items-start justify-between text-[18px] font-bold">
              <div className="mr-4 flex w-[35%] items-center">
                <p className="pr-2">Project</p>
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
            {filteredTasks.map((task) => (
              <TasksModal key={task.id} task={task} isLoading={false} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default TransactionList
