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

const TransactionList = () => {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [departament, setDepartament] = useState('All')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition[] | undefined>(
    [],
  )
  const [taskChainData, setTaskChainData] = useState<any[]>([])
  const pathname = usePathname()

  const { push } = useRouter()

  const tasks = [
    {
      id: 1,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Trading research',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Ai', 'Blockchain', 'Science'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['250 USDT'],
    },
  ]

  const handleDepartamentSelection = (value: string) => {
    updateUrl('departament', value)
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

  async function getTasks() {
    console.log('getting task count')
    const data = await readContract({
      address: `0x95a7CC5a3E9D16626169267780096f2C0db896E1`,
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
      address: `0x95a7CC5a3E9D16626169267780096f2C0db896E1`,
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

  const handleUpdate = () => {
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
        if (orderBy === 'Oldest') {
          newFilteredTasks.sort((a, b) => a.id - b.id)
        } else if (orderBy === 'Newest') {
          newFilteredTasks.sort((a, b) => b.id - a.id)
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
      }
    }
    setIsLoading(false)
    // getTasks()
    filterTasks()
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
      <section className="py-16 px-32 text-black md:py-20 lg:pt-32">
        <div className="container">
          <div className="mx-auto mb-10 flex justify-center text-center">
            <span
              onClick={() => {
                handleDepartamentSelection('All')
              }}
              className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
                departament === 'All' || !departament
                  ? 'text-lg font-extrabold'
                  : ''
              }`}
            >
              All
            </span>
            <button onClick={logData}>teste</button>
            <span
              onClick={() => {
                handleDepartamentSelection('Data and analytics')
              }}
              className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
                departament === 'Data and analytics'
                  ? 'text-lg font-extrabold'
                  : ''
              }`}
            >
              Data and analytics
            </span>
            <span
              onClick={() => {
                handleDepartamentSelection('Smart-contracts and DLTs')
              }}
              className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
                departament === 'Smart-contracts and DLTs'
                  ? 'text-lg font-extrabold'
                  : ''
              }`}
            >
              Smart-contracts and DLTs
            </span>
            <span
              onClick={() => {
                handleDepartamentSelection('Cloud and DevOps')
              }}
              className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
                departament === 'Cloud and DevOps'
                  ? 'text-lg font-extrabold'
                  : ''
              }`}
            >
              Cloud and DevOps
            </span>
            <span
              onClick={() => {
                handleDepartamentSelection('Admin and Operations')
              }}
              className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
                departament === 'Admin and Operations'
                  ? 'text-lg font-extrabold'
                  : ''
              }`}
            >
              Admin and Operations
            </span>
          </div>
          <SearchModal onUpdate={handleUpdate} />

          <div className="max-h-[800px] overflow-auto pr-2 text-[#000000] scrollbar-thin scrollbar-thumb-body-color">
            <div className="flex pr-1">
              <div className="-mr-[0.75px] w-[15%] border border-r-0 border-[#e8e5e5] py-1 pl-2  font-semibold">
                <span>Title</span>
              </div>
              <div className="w-[15%] border  border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
                <span>Categories</span>
              </div>
              <div className="w-[35%] border  border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
                <span>Description</span>
              </div>
              <div className="w-[10%] border border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
                <span>Author</span>
              </div>
              <div className="w-[10%] border border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
                <span>Status</span>
              </div>
              <div className="w-[15%] border border-[#e8e5e5] py-1 pl-2 font-semibold">
                <span>Budget</span>
              </div>
            </div>
            {filteredTasks.map((task) => (
              <TasksModal key={task.id} {...task} isLoading={false} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default TransactionList
