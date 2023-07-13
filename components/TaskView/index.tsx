/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { UserOutlined } from '@ant-design/icons'
import TransactionList from '../TaskTransactionsList'
import { ethers } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import {
  readContract,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
} from '@wagmi/core'
import taskContractABI from '@/utils/abi/taskContractABI.json'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IPFSSubmition } from '@/types/task'

const TaskView = (id: any) => {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [departament, setDepartament] = useState('All')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imgTaskIPFS, setImgTaskIPFS] = useState('')
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition>()
  const [taskChainData, setTaskChainData] = useState<any>()

  const { push } = useRouter()

  const taskState = [
    { state: 'Open', img: 'circle-green-task.svg' },
    { state: 'Taken', img: 'circle-yellow-task.svg' },
    { state: 'Closed', img: 'circle-gray-task.svg' },
  ]

  async function getTaskFromChain(id: any) {
    setIsLoading(true)
    console.log('getting data from task')
    const data = await readContract({
      address: `0x95a7CC5a3E9D16626169267780096f2C0db896E1`,
      abi: taskContractABI,
      args: [Number(id)],
      functionName: 'getTask',
    })

    if (!data) {
      toast.error(
        'Something occurred while fetching data from the smart-contract!',
      )
      await new Promise((resolve) => setTimeout(resolve, 1000))
      push('/')
    }
    console.log('the data:')
    console.log(data)
    setTaskChainData(data)
    await getDataFromIPFS(data['metadata'])
  }

  function truncateHash(hash) {
    const start = hash.slice(0, 5)
    const end = hash.slice(-5)
    return `${start}...${end}`
  }

  async function getDataFromIPFS(hash: string) {
    const url = `https://cloudflare-ipfs.com/ipfs/${hash}`

    await axios
      .get(url)
      .then(async (response) => {
        console.log('the metadata:')
        console.log(response.data)
        if (response.data.file) {
          setImgTaskIPFS(
            `https://cloudflare-ipfs.com/ipfs/${response.data.file}`,
          )
        }
        await setTaskMetadata(response.data)
        await getDecimalsFromPaymentsToken(response.data.payments)
        console.log('after the validation:')
        console.log(taskMetadata)
        setIsLoading(false)
      })
      .catch(async (err) => {
        toast.error('Something occurred while fetching data from IPFS!')
        await new Promise((resolve) => setTimeout(resolve, 1000))
        push('/')
        console.log(err)
      })
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
    // updating the state with the modified copy
    setTaskMetadata((prevState) => ({ ...prevState, payments: newPayments }))
  }
  useEffect(() => {
    if (id) {
      setIsLoading(true)
      console.log('search for the task info on blockchain')
      console.log(id.id)
      getTaskFromChain(id.id)
    }
  }, [id])
  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading || !taskMetadata) {
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
    <section className="py-16 px-32 text-black md:py-20 lg:pt-40">
      <div className="container  border-b border-[#8d8d8d] pb-12">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-normal  sm:text-3xl lg:text-4xl xl:text-5xl">
                  {taskMetadata.title}
                </h3>
                <div className="mt-10 flex text-[#595959]">
                  <p>Available funds</p>{' '}
                  <div className="ml-4 flex max-w-xl items-start justify-start px-2">
                    {taskMetadata.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex text-base text-[#000000]"
                      >
                        <p>{Number(payment.amount) / 10 ** payment.decimals}</p>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://mumbai.polygonscan.com/token/${payment.tokenContract}`}
                          className="mt-1 ml-1 flex text-sm hover:text-primary"
                        >
                          {truncateHash(payment.tokenContract)}
                        </a>
                        {index < taskMetadata.payments.length - 1 && (
                          <span className="mr-2">,</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="mt-14 flex">
                    <button className="mr-8 border border-[#0057E1] bg-[#0057E1] px-3 py-1 text-sm text-white hover:border-[#0057E1] hover:bg-white hover:text-[#0057E1]">
                      {' '}
                      Start working{' '}
                    </button>
                    <button className="border bg-white px-3 py-1 text-sm text-[#0057E1] hover:border-white hover:bg-[#0057E1] hover:text-white">
                      {' '}
                      View on Github{' '}
                    </button>
                  </div>
                  <div className="">
                    <div className="flex justify-end">
                      {' '}
                      <img
                        src={`/images/task/${
                          taskState[taskChainData.state].img
                        }`}
                        alt="image"
                        className={`w-[34px]`}
                      />
                      <p className="">
                        {' '}
                        {taskState[taskChainData.state].state}
                      </p>
                    </div>

                    <p className="mt-8 text-[#595959]">
                      {' '}
                      Deadline:{' '}
                      {
                        new Date(taskMetadata.deadline)
                          .toISOString()
                          .split('T')[0]
                      }
                    </p>
                  </div>
                </div>
                <div className="mt-14 flex">
                  <p className=" text-[#595959]">Project scope</p>
                  <div className="ml-16 flex space-x-2">
                    {taskMetadata.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-[#01E2AC] px-2 py-1 text-[11px] font-bold text-[#000000]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex">
                  <p className=" text-[#595959]">Main contributors</p>
                  <div className="ml-8 flex space-x-2">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://mumbai.polygonscan.com/address/${taskChainData.proposer}`}
                      className="mt-1 flex hover:text-primary"
                    >
                      <UserOutlined />
                      <p
                        className="overflow-hidden text-xs font-semibold line-clamp-5 lg:text-xs lg:line-clamp-6"
                        title={taskChainData.proposer}
                      >
                        {formatAddress(taskChainData.proposer)}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container  mt-12">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1">
                <p className="mb-4 text-xl font-bold  sm:text-3xl lg:text-xl">
                  Project description
                </p>
                <div className="flex">
                  <div className="mt-10 w-3/4 text-sm font-light">
                    {imgTaskIPFS ? (
                      <img
                        src={imgTaskIPFS}
                        alt="project desc"
                        className="h-[375px] w-[375px]"
                      ></img>
                    ) : (
                      <></>
                    )}

                    <p className="mt-16">{taskMetadata.description}</p>
                    <p className="mt-14 text-xl font-semibold">
                      Relevant links
                    </p>
                    {taskMetadata.links.map((link, index) => (
                      <p className="mt-1 flex" key={index}>
                        <p className="">{link.title}</p>
                        <p className="mr-2">:</p>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                          href={link.url}
                        >
                          {link.url}
                        </a>
                      </p>
                    ))}
                  </div>
                  <div className="w-1/4 pl-20 text-base font-normal text-[#363636]">
                    <p>View project calendar</p>
                    <a
                      href="https://calendar.google.com/calendar/u/0/r"
                      target="_blank"
                      rel="nofollow noreferrer"
                    >
                      <img
                        src="/images/task/calendar-google-2.png"
                        alt="image"
                        className={`mt-4 ml-1 w-[70px] hover:z-20 hover:scale-110`}
                      />
                    </a>
                    <div className="mt-12 text-sm">
                      <p>10:30 PM UTC 23-12-2021</p>
                      <p>Next meeting</p>
                    </div>
                    <div className="mt-12 text-sm">
                      <p>Talk to contributors</p>
                      <a
                        href="https://discord.gg/JppWPVjt"
                        target="_blank"
                        rel="nofollow noreferrer"
                      >
                        <img
                          src="/images/task/discord.svg"
                          alt="image"
                          className={`mt-4 ml-1 w-[40px] hover:z-20 hover:scale-110`}
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-20">
                  <TransactionList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TaskView
