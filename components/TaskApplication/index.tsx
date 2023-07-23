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
import HeroTaskApplication from './HeroTaskApplication'

const TaskView = (id: any) => {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [departament, setDepartament] = useState('All')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imgTaskIPFS, setImgTaskIPFS] = useState('')
  const [viewOption, setViewOption] = useState('projectDescription')
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition>()
  const [taskChainData, setTaskChainData] = useState<any>()
  const [transactionCount, setTransactionCount] = useState<number>(0)
  const { address, isConnecting, isDisconnected } = useAccount()

  const { push } = useRouter()

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  const taskState = [
    { state: 'Open', img: 'circle-green-task.svg' },
    { state: 'Taken', img: 'circle-yellow-task.svg' },
    { state: 'Closed', img: 'circle-gray-task.svg' },
  ]

  async function getTaskFromChain(id: any) {
    setIsLoading(true)
    console.log('getting data from task')
    const data = await readContract({
      address: `0x${taskAddress.substring(2)}`,
      abi: taskContractABI,
      args: [Number(id)],
      functionName: 'getTask',
    })

    if (!data) {
      toast.error('Task not found!')
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

  if (!address) {
    return (
      <div className="pb-[500px]">
        <HeroTaskApplication />
      </div>
    )
  }

  if (isLoading) {
    return (
      <section className="py-16 px-32 text-black md:py-20 lg:pt-40">
        <div className="container flex h-60 animate-pulse px-0 pb-12">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="container h-96 animate-pulse bg-[#dfdfdf] pb-12"></div>
      </section>
    )
  }

  if (!isLoading && !taskChainData) {
    return (
      <section className="py-16 px-32 text-black md:py-20 lg:pt-40">
        <div className="container flex h-60 animate-pulse px-0 pb-12">
          Task not found
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-32 text-[#000000] md:py-20 lg:pt-40">
      <div className="container  border-b border-[#8d8d8d] pb-12">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1 flex justify-between">
                <div className="w-4/5">
                  <h3 className="mb-4 text-[30px] font-bold">
                    {taskMetadata.title}
                  </h3>
                  <p
                    title={taskMetadata.description}
                    className="overflow-hidden text-[24px] font-medium !leading-tight text-[#505050] line-clamp-3"
                  >
                    {taskMetadata.description}
                  </p>
                  <div className="mt-10 flex text-[20px] font-medium text-[#505050]">
                    <p>Available funds</p>{' '}
                    <div className="ml-4 mt-1 flex max-w-xl items-start justify-start px-2">
                      {taskMetadata.payments.map((payment, index) => (
                        <div
                          key={index}
                          className="flex text-base text-[#000000]"
                        >
                          <p>
                            {Number(payment.amount) / 10 ** payment.decimals}
                          </p>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://mumbai.polygonscan.com/token/${payment.tokenContract}`}
                            className="mt-[2px] ml-1 flex text-sm hover:text-primary"
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
                  {/* <div className="flex justify-between">
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
                  </div> */}
                  {/* <div className="mt-14 flex">
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
                  </div> */}
                  {/* <div className="mt-4 flex">
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
                  </div> */}
                </div>
                <div className="w-[162px] pt-11">
                  {' '}
                  <div className="flex justify-end text-[20px] font-bold text-[#505050]">
                    {' '}
                    <img
                      src={`/images/task/${taskState[taskChainData.state].img}`}
                      alt="image"
                      className={`w-[34px]`}
                    />
                    <p className="">
                      Status: {taskState[taskChainData.state].state}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-start pl-3 text-[20px] font-bold">
                    <div>
                      <p className=""> Deadline: </p>
                      <p className="font-normal">
                        {
                          new Date(taskMetadata.deadline)
                            .toISOString()
                            .split('T')[0]
                        }
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pl-3">
                    <button
                      onClick={() => {
                        console.log('a quantidade de updates')
                        console.log(transactionCount)
                      }}
                      className="ml-auto w-[150px] cursor-pointer rounded-md bg-[#12AD50] py-2 px-3 text-[18px] font-bold text-white hover:bg-[#0b9040]"
                    >
                      Start working
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container  mt-12 font-medium">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1">
                <div className="text-18 mb-4 flex font-bold">
                  <div
                    className={`mr-12  pb-2 ${
                      viewOption === 'projectDescription'
                        ? 'border-b-[2px] border-[#000000]'
                        : ''
                    }`}
                  >
                    <p
                      onClick={() => {
                        setViewOption('projectDescription')
                      }}
                      className="cursor-pointer hover:text-[#353535]"
                    >
                      Project description
                    </p>
                  </div>
                  <div
                    className={`pb-2 ${
                      viewOption === 'updates'
                        ? 'border-b-[2px] border-[#000000]'
                        : ''
                    }`}
                  >
                    <p
                      onClick={() => {
                        setViewOption('updates')
                      }}
                      className="cursor-pointer hover:text-[#353535]"
                    >
                      Updates
                      {/* Aqui inserir o numero de updates (transactions events) que teve */}
                    </p>
                  </div>
                </div>
                <div className="mt-10 flex">
                  {viewOption === 'projectDescription' ? (
                    <div className="mt-8 w-[65%] text-[20px] font-normal">
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
                  ) : (
                    <div className="mt-8 w-[65%]">
                      <TransactionList id={id} />
                    </div>
                  )}

                  <div className="mt-8 w-[35%] pl-20 text-[#363636]">
                    <div className="shadow-lg">
                      <div className="flex h-[89px] items-center bg-[#F7F8F9] px-8 text-[24px] font-medium text-[#505050]">
                        <p>More details</p>
                      </div>
                      {/* <a
                        href="https://calendar.google.com/calendar/u/0/r"
                        target="_blank"
                        rel="nofollow noreferrer"
                      >
                        <img
                          src="/images/task/calendar-google-2.png"
                          alt="image"
                          className={`mt-4 ml-1 w-[70px] hover:z-20 hover:scale-110`}
                        />
                      </a> */}
                      <div className="mt-8 px-8 pb-8 text-[18px]">
                        <a
                          href="https://github.com/"
                          target="_blank"
                          rel="nofollow noreferrer"
                          className="border-b border-[#0085FF] font-normal text-[#0085FF]"
                        >
                          View on Github
                        </a>
                        <div className="mt-4">
                          <p className="font-bold text-[#505050]">
                            Last Updated:
                          </p>
                          <p>3 days ago</p>
                        </div>
                        <div className="mt-4">
                          <p className="font-bold text-[#505050]">
                            Next meeting:
                          </p>
                          <p>10:30 PM UTC 23-12-2021</p>
                        </div>
                        <div className="mt-4">
                          <p>Reacht out to a</p>
                          <a
                            href="https://github.com/"
                            target="_blank"
                            rel="nofollow noreferrer"
                            className="border-b border-[#0085FF] text-[#0085FF]"
                          >
                            verified contributor
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="mt-10 shadow-lg">
                      <div className="flex h-[89px] items-center bg-[#F7F8F9] px-8 text-[24px] font-medium text-[#505050]">
                        <p>Contributors</p>
                      </div>
                      <div className="mt-8 px-8 pb-8 text-[18px] font-normal">
                        Empty
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" mt-20 flex w-[68%] rounded-md bg-[#F5F5F5]  py-9 pl-12 text-center text-[20px] text-[#505050]">
                  <p>
                    | Have more questions? Reach out to{' '}
                    <a
                      href="https://mumbai.polygonscan.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="border-b border-[#0084FE] text-[#0084FE]"
                    >
                      a verified contributor
                    </a>
                  </p>
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
