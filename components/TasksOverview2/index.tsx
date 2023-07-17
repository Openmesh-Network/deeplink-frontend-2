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
      id: 2,
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
      id: 3,
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
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      // push('/')
    }
    console.log('getting tasks data')
    await getTaskFromChain(Number(data))

    // await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('all the result')
    console.log(taskChainData)
    console.log(taskMetadata)
    setIsLoading(false)
  }
  async function getTaskFromChain(id: number) {
    const listTasks = []
    for (let i = 0; i < id; i++) {
      const objTask = {
        address: `0x${taskAddress.substring(2)}`,
        // eslint-disable-next-line prettier/prettier
        abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ApplicationDoesNotExist","type":"error"},{"inputs":[],"name":"ApplicationNotAccepted","type":"error"},{"inputs":[],"name":"NotExecutor","type":"error"},{"inputs":[],"name":"NotProposer","type":"error"},{"inputs":[],"name":"NotYourApplication","type":"error"},{"inputs":[],"name":"RequestAlreadyAccepted","type":"error"},{"inputs":[],"name":"RequestDoesNotExist","type":"error"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"}],"name":"RewardAboveBudget","type":"error"},{"inputs":[],"name":"SubmissionAlreadyJudged","type":"error"},{"inputs":[],"name":"SubmissionDoesNotExist","type":"error"},{"inputs":[],"name":"TaskClosed","type":"error"},{"inputs":[],"name":"TaskDoesNotExist","type":"error"},{"inputs":[],"name":"TaskNotClosed","type":"error"},{"inputs":[],"name":"TaskNotOpen","type":"error"},{"inputs":[],"name":"TaskNotTaken","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"uint16","name":"applicationId","type":"uint16"},{"indexed":false,"internalType":"address","name":"applicant","type":"address"},{"indexed":false,"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"indexed":false,"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"name":"ApplicationCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"uint16[]","name":"applications","type":"uint16[]"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"}],"name":"ApplicationsAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"submissionId","type":"uint8"},{"indexed":false,"internalType":"address","name":"executor","type":"address"},{"indexed":false,"internalType":"string","name":"metadata","type":"string"}],"name":"SubmissionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"submissionId","type":"uint8"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"enum ITasks.SubmissionJudgement","name":"judgement","type":"uint8"},{"indexed":false,"internalType":"string","name":"feedback","type":"string"}],"name":"SubmissionReviewed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"string","name":"metadata","type":"string"},{"indexed":false,"internalType":"uint64","name":"deadline","type":"uint64"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint96","name":"amount","type":"uint96"}],"indexed":false,"internalType":"struct ITasks.ERC20Transfer[]","name":"budget","type":"tuple[]"}],"name":"TaskCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":false,"internalType":"uint16","name":"applicationId","type":"uint16"},{"indexed":false,"internalType":"address","name":"applicant","type":"address"}],"name":"TaskTaken","type":"event"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"uint16[]","name":"_applications","type":"uint16[]"}],"name":"acceptApplications","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"enum ITasks.RequestType","name":"_requestType","type":"uint8"},{"internalType":"uint8","name":"_requestId","type":"uint8"}],"name":"acceptRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"string","name":"_metadata","type":"string"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"_reward","type":"tuple[]"}],"name":"applyForTask","outputs":[{"internalType":"uint16","name":"applicationId","type":"uint16"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"string","name":"_explanation","type":"string"}],"name":"cancelTask","outputs":[{"internalType":"uint8","name":"cancelTaskRequestId","type":"uint8"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"string","name":"_newMetadata","type":"string"},{"internalType":"uint64","name":"_newDeadline","type":"uint64"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"_newReward","type":"tuple[]"}],"name":"changeScope","outputs":[{"internalType":"uint8","name":"changeTaskRequestId","type":"uint8"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"string","name":"_metadata","type":"string"}],"name":"createSubmission","outputs":[{"internalType":"uint8","name":"submissionId","type":"uint8"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_metadata","type":"string"},{"internalType":"uint64","name":"_deadline","type":"uint64"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint96","name":"amount","type":"uint96"}],"internalType":"struct ITasks.ERC20Transfer[]","name":"_budget","type":"tuple[]"}],"name":"createTask","outputs":[{"internalType":"uint256","name":"taskId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"string","name":"_explanation","type":"string"}],"name":"dropExecutor","outputs":[{"internalType":"uint8","name":"dropExecutorRequestId","type":"uint8"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_executor","type":"address"},{"internalType":"uint256","name":"_fromTaskId","type":"uint256"},{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"getExecutingTasks","outputs":[{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"internalType":"uint64","name":"creationTimestamp","type":"uint64"},{"internalType":"uint64","name":"executorConfirmationTimestamp","type":"uint64"},{"internalType":"uint16","name":"executorApplication","type":"uint16"},{"internalType":"address","name":"proposer","type":"address"},{"internalType":"enum ITasks.TaskState","name":"state","type":"uint8"},{"internalType":"contract Escrow","name":"escrow","type":"address"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint96","name":"amount","type":"uint96"}],"internalType":"struct ITasks.ERC20Transfer[]","name":"budget","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"address","name":"applicant","type":"address"},{"internalType":"bool","name":"accepted","type":"bool"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainApplication[]","name":"applications","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"enum ITasks.SubmissionJudgement","name":"judgement","type":"uint8"},{"internalType":"uint64","name":"judgementTimestamp","type":"uint64"},{"internalType":"string","name":"feedback","type":"string"}],"internalType":"struct ITasks.Submission[]","name":"submissions","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainChangeScopeRequest[]","name":"changeScopeRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.DropExecutorRequest[]","name":"dropExecutorRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.CancelTaskRequest[]","name":"cancelTaskRequests","type":"tuple[]"}],"internalType":"struct ITasks.OffChainTask[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_proposer","type":"address"},{"internalType":"uint256","name":"_fromTaskId","type":"uint256"},{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"getProposingTasks","outputs":[{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"internalType":"uint64","name":"creationTimestamp","type":"uint64"},{"internalType":"uint64","name":"executorConfirmationTimestamp","type":"uint64"},{"internalType":"uint16","name":"executorApplication","type":"uint16"},{"internalType":"address","name":"proposer","type":"address"},{"internalType":"enum ITasks.TaskState","name":"state","type":"uint8"},{"internalType":"contract Escrow","name":"escrow","type":"address"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint96","name":"amount","type":"uint96"}],"internalType":"struct ITasks.ERC20Transfer[]","name":"budget","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"address","name":"applicant","type":"address"},{"internalType":"bool","name":"accepted","type":"bool"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainApplication[]","name":"applications","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"enum ITasks.SubmissionJudgement","name":"judgement","type":"uint8"},{"internalType":"uint64","name":"judgementTimestamp","type":"uint64"},{"internalType":"string","name":"feedback","type":"string"}],"internalType":"struct ITasks.Submission[]","name":"submissions","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainChangeScopeRequest[]","name":"changeScopeRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.DropExecutorRequest[]","name":"dropExecutorRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.CancelTaskRequest[]","name":"cancelTaskRequests","type":"tuple[]"}],"internalType":"struct ITasks.OffChainTask[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"}],"name":"getTask","outputs":[{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"internalType":"uint64","name":"creationTimestamp","type":"uint64"},{"internalType":"uint64","name":"executorConfirmationTimestamp","type":"uint64"},{"internalType":"uint16","name":"executorApplication","type":"uint16"},{"internalType":"address","name":"proposer","type":"address"},{"internalType":"enum ITasks.TaskState","name":"state","type":"uint8"},{"internalType":"contract Escrow","name":"escrow","type":"address"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint96","name":"amount","type":"uint96"}],"internalType":"struct ITasks.ERC20Transfer[]","name":"budget","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"address","name":"applicant","type":"address"},{"internalType":"bool","name":"accepted","type":"bool"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainApplication[]","name":"applications","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"enum ITasks.SubmissionJudgement","name":"judgement","type":"uint8"},{"internalType":"uint64","name":"judgementTimestamp","type":"uint64"},{"internalType":"string","name":"feedback","type":"string"}],"internalType":"struct ITasks.Submission[]","name":"submissions","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainChangeScopeRequest[]","name":"changeScopeRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.DropExecutorRequest[]","name":"dropExecutorRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.CancelTaskRequest[]","name":"cancelTaskRequests","type":"tuple[]"}],"internalType":"struct ITasks.OffChainTask","name":"offchainTask","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_taskIds","type":"uint256[]"}],"name":"getTasks","outputs":[{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"internalType":"uint64","name":"creationTimestamp","type":"uint64"},{"internalType":"uint64","name":"executorConfirmationTimestamp","type":"uint64"},{"internalType":"uint16","name":"executorApplication","type":"uint16"},{"internalType":"address","name":"proposer","type":"address"},{"internalType":"enum ITasks.TaskState","name":"state","type":"uint8"},{"internalType":"contract Escrow","name":"escrow","type":"address"},{"components":[{"internalType":"contract IERC20","name":"tokenContract","type":"address"},{"internalType":"uint96","name":"amount","type":"uint96"}],"internalType":"struct ITasks.ERC20Transfer[]","name":"budget","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"address","name":"applicant","type":"address"},{"internalType":"bool","name":"accepted","type":"bool"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainApplication[]","name":"applications","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"enum ITasks.SubmissionJudgement","name":"judgement","type":"uint8"},{"internalType":"uint64","name":"judgementTimestamp","type":"uint64"},{"internalType":"string","name":"feedback","type":"string"}],"internalType":"struct ITasks.Submission[]","name":"submissions","type":"tuple[]"},{"components":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"},{"internalType":"uint64","name":"deadline","type":"uint64"},{"components":[{"internalType":"bool","name":"nextToken","type":"bool"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint88","name":"amount","type":"uint88"}],"internalType":"struct ITasks.Reward[]","name":"reward","type":"tuple[]"}],"internalType":"struct ITasks.OffChainChangeScopeRequest[]","name":"changeScopeRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.DropExecutorRequest[]","name":"dropExecutorRequests","type":"tuple[]"},{"components":[{"internalType":"string","name":"explanation","type":"string"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"accepted","type":"uint64"}],"internalType":"struct ITasks.CancelTaskRequest[]","name":"cancelTaskRequests","type":"tuple[]"}],"internalType":"struct ITasks.OffChainTask[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"uint8","name":"_submission","type":"uint8"},{"internalType":"enum ITasks.SubmissionJudgement","name":"_judgement","type":"uint8"},{"internalType":"string","name":"_feedback","type":"string"}],"name":"reviewSubmission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_taskId","type":"uint256"},{"internalType":"uint16","name":"_application","type":"uint16"}],"name":"takeTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"taskCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"taskStatistics","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
        functionName: 'getTask',
        args: [i],
      }
      listTasks.push(objTask)
    }
    const data = await readContracts({
      // eslint-disable-next-line prettier/prettier
      contracts: listTasks
    })
    if (data) {
      console.log(`the chaind data`)
      console.log(data)
      // await setTaskChainData((prevState) => [...prevState, data])
      // await getDataFromIPFS(data['metadata'])
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
    console.log('useEffect chamado')
    getTasks()
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
                <p
                  onClick={() => {
                    console.log('as tasks')
                    console.log(tasks)
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
