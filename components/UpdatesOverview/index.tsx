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

type UpdatesListProps = {
  taskId: string
}

// eslint-disable-next-line prettier/prettier
const UpdatesOverview = () => {
  const [events, setEvents] = useState<Event[] | ApplicationOffChain[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pathname = usePathname()

  const { push } = useRouter()

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
        // console.log('minhas responses')
        // console.log(response)
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
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`
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
    // console.log('useEffect chamado')
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
  return (
    <div className="mx-auto w-full px-[50px] py-[100px] text-[11px] font-medium !leading-[19px] text-[#505050] md:py-[120px] lg:py-[140px] lg:text-[14px] xl:max-w-[1200px] xl:py-[110px] 2xl:max-w-[1500px] 2xl:py-[150px]">
      <div className="mb-[60px] text-[12.5px] text-[#000] md:text-[15px] lg:text-[17.5px] xl:text-[20px]  2xl:text-[25px]">
        OpenR&D Activities
      </div>
      {!isLoading &&
        events.length > 0 &&
        events.map((event, index) => {
          return (
            <div
              className={`${
                index === 0 ? '' : 'mt-[25px]'
              } rounded-[10px] bg-[#F5F5F5] py-[25px] px-[25px] lg:py-[40px] lg:px-[35px]`}
              key={index}
            >
              <div className="lg:flex">
                <div className="flex">
                  <img
                    alt="ethereum avatar"
                    src={renderEventImage(event)}
                    className="mr-[10px] w-[25px] rounded-full"
                  ></img>
                  {!event.offChain && (
                    <a
                      className=" flex items-center text-[#505050] hover:text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://${process.env.NEXT_PUBLIC_SCAN_BASE_URL}.com/address/${event.address}`}
                    >
                      {formatAddress(event.address)}
                    </a>
                  )}
                </div>
                <div className="ml-auto mt-[15px] flex items-center font-normal lg:mt-0">
                  {formatDeadlineComplet(event.timestamp)}
                </div>
              </div>
              <div className="mt-[15px] lg:flex">
                <div className="">
                  <p className="flex text-[#000000] lg:ml-[35px] lg:items-center ">
                    {renderEventName(event)}
                  </p>
                  <p className="mt-[20px]  flex text-[#000000] lg:ml-[35px] lg:items-center">
                    Task Id:{' '}
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? `/openrd/task/${event.taskId}`
                          : `/task/${event.taskId}`
                      }`}
                    >
                      <p className="ml-[5px] text-[#0354EC] hover:text-[#25385a]">
                        {event.taskId}
                      </p>
                    </a>
                  </p>
                </div>
                <div className="ml-auto mt-[15px] flex items-center lg:mt-0">
                  {!event.offChain && (
                    <a
                      className=" flex items-center border-b-[1px] border-[#0354EC] text-[#0354EC] hover:text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://${process.env.NEXT_PUBLIC_SCAN_BASE_URL}.com/tx/${event.transactionHash}`}
                    >
                      View on Etherscan
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default UpdatesOverview
