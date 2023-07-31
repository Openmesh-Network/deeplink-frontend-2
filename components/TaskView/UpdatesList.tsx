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
import { Event } from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import { File, SmileySad, Info } from 'phosphor-react'

type UpdatesListProps = {
  taskId: string
}

// eslint-disable-next-line prettier/prettier
const UpdatesList = ({taskId}: UpdatesListProps) => {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pathname = usePathname()

  const { push } = useRouter()

  function formatDeadline(timestamp) {
    const date = new Date(Number(timestamp) * 1000)
    let difference = formatDistanceToNow(date)

    // Aqui estamos tratando a frase para exibir 'today' se a task foi criada no mesmo dia
    difference = `${difference.charAt(0).toUpperCase()}${difference.slice(
      1,
    )} ago`
    return difference
  }

  async function handleEvents(id: string) {
    const dataBody = {
      id,
    }
    setIsLoading(true)
    const config = {
      method: 'post' as 'post',
      url: `https://dpl-backend-homolog.up.railway.app/functions/getTaskEvents`,
      headers: {
        'x-parse-application-id':
          'as90qw90uj3j9201fj90fj90dwinmfwei98f98ew0-o0c1m221dds222143',
      },
      data: dataBody,
    }

    try {
      await axios(config).then(function (response) {
        if (response.data) {
          setEvents(response.data)
        }
      })
    } catch (err) {
      toast.error('Error getting the updates!')
      console.log(err)
    }

    setIsLoading(false)
  }

  // When I want to scroll manually to the tasks
  const scrollManually = () => {
    const taskStartElement = document.getElementById('taskStart')
    taskStartElement.scrollIntoView({ behavior: 'smooth' })
  }

  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  function NoEvents() {
    return (
      <div className="mt-[64px] mb-[100px] flex flex-col items-center">
        <SmileySad size={32} className="text-blue-500 mb-2" />
        <span>No events found</span>
      </div>
    )
  }

  useEffect(() => {
    console.log('useEffect chamado')
    handleEvents(taskId)
  }, [taskId])

  if (isLoading) {
    return (
      <div className="h-30 flex animate-pulse px-0 pb-12">
        <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
        <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
      </div>
    )
  }

  if (events && events.length === 0) {
    return NoEvents()
  }

  return (
    <div className="mr-[50px] w-full text-[14px] font-medium !leading-[19px] text-[#505050]">
      {!isLoading &&
        events.length > 0 &&
        events.map((event, index) => (
          <div
            className={`${
              index === 0 ? '' : 'mt-[25px]'
            } rounded-[10px] bg-[#F5F5F5] py-[40px] px-[35px]`}
            key={index}
          >
            <div className="flex">
              <img
                alt="ethereum avatar"
                src={`https://effigy.im/a/${event.address}.svg`}
                className="mr-[10px] w-[25px] rounded-full"
              ></img>
              <a
                className=" flex items-center text-[#505050] hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://polygonscan.com/address/${event.address}`}
              >
                {formatAddress(event.address)}
              </a>
            </div>
          </div>
        ))}
    </div>
  )
}

export default UpdatesList
