/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
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
import { ApplicationOffChain, Event } from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import { File, SmileySad, Info } from 'phosphor-react'
import { useAccount, useNetwork } from 'wagmi'
import ConnectYourWallet from './ConnectYourWallet'
import Dashboard from './Dashboard'

type UpdatesListProps = {
  taskId: string
}

// eslint-disable-next-line prettier/prettier
const Staking = () => {
  const [events, setEvents] = useState<Event[] | ApplicationOffChain[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pathname = usePathname()

  const { push } = useRouter()
  const { address } = useAccount()

  const eventsNameFormatted = {
    ApplicationCreated: 'New application',
    TaskCreated: 'Task created',
    ApplicationAccepted: 'An application was accepted',
    TaskTaken: 'The task was taken',
    SubmissionCreated: 'New submission',
    SubmissionReviewed: 'New submission revision',
    TaskCompleted: 'The task was completed',
    BudgetIncreased: 'The budget was increased',
  }

  function formatDeadlineComplet(timestamp) {
    const dateInMilliseconds = parseInt(timestamp, 10) * 1000 // converta para milissegundos
    const formattedDeadline = format(
      new Date(dateInMilliseconds),
      "HH:mm:ss 'UTC', dd MMMM yyyy",
    )
    return formattedDeadline
  }

  async function handleEvents() {
    setIsLoading(true)
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/functions/getTasksEvents`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      },
    }

    try {
      await axios(config).then(function (response) {
        console.log('minhas responses')
        console.log(response)
        if (response.data) {
          setEvents(response.data.sort((a, b) => b.timestamp - a.timestamp))
        }
      })
    } catch (err) {
      toast.error('Error getting the updates!')
      console.log(err)
    }

    setIsLoading(false)
  }

  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  function NoEvents() {
    return (
      <div className="mr-[50px] flex w-full items-center justify-center">
        <SmileySad size={32} className="text-blue-500 mb-2" />
        <span className="">No updates found</span>
      </div>
    )
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    console.log('useEffect chamado')
    handleEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="mr-[50px] w-full">
        <div className="flex h-[150px] w-full animate-pulse rounded-[10px] bg-[#dfdfdf]"></div>
        <div className="mt-[25px] flex h-[150px] w-full animate-pulse rounded-[10px]  bg-[#dfdfdf]"></div>
      </div>
    )
  }

  if (events && events.length === 0) {
    return NoEvents()
  }

  // functions to render both on chain e off chain applicaitons values
  function renderEventImage(event: any) {
    if (event.offChain) {
      return event.openmeshExpertUser?.profilePictureHash
        ? `https://cloudflare-ipfs.com/ipfs/${event.openmeshExpertUser.profilePictureHash}`
        : `https://effigy.im/a/0x1019338c8D59020B8320EE0CE6875FeeD286b398.svg`
    } else {
      return `https://effigy.im/a/${event.address}.svg`
    }
  }

  function renderEventName(event: any) {
    if (event.offChain) {
      return `${
        event.openmeshExpertUser.isCompany
          ? event.openmeshExpertUser.companyName
          : event.openmeshExpertUser.firstName
      } applied`
    } else {
      return eventsNameFormatted[event.name]
    }
  }

  if (!address) {
    return (
      <div className="flex justify-center pb-[10px] lg:pb-[500px]">
        <ConnectYourWallet />
      </div>
    )
  }

  return (
    <div className="flex justify-center pb-[10px] lg:pb-[500px]">
      <Dashboard />
    </div>
  )
}

export default Staking
