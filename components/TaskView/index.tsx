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
import { IPFSSubmition, TasksOverview } from '@/types/task'
import HeroTask from './HeroTask'

const TaskView = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imgTaskIPFS, setImgTaskIPFS] = useState('')
  const [viewOption, setViewOption] = useState('projectDescription')
  const [taskMetadata, setTaskMetadata] = useState<TasksOverview>()

  const { push } = useRouter()

  const taskStateCircle = {
    open: 'circle-green-task.svg',
    taken: 'circle-yellow-task.svg',
    closed: 'circle-gray-task.svg',
  }

  const mockDataContributors = [{address: '0x0DD7167d9707faFE0837c0b1fe12348AfAabF170'}, {address: '0x0D49C384055bAe6865982e40fC811264fAA1DA17'}, {address: '0x08ADb3400E48cACb7d5a5CB386877B3A159d525C'}]

  const taskState = [
    { state: 'Open', img: 'circle-green-task.svg' },
    { state: 'Taken', img: 'circle-yellow-task.svg' },
    { state: 'Closed', img: 'circle-gray-task.svg' },
  ]

  function truncateHash(hash) {
    const start = hash.slice(0, 5)
    const end = hash.slice(-5)
    return `${start}...${end}`
  }

  async function getTask(id: any) {
    const dataBody = {
      id,
    }
    setIsLoading(true)
    const config = {
      method: 'post' as 'post',
      url: `https://dpl-backend-homolog.up.railway.app/functions/getTask`,
      headers: {
        'x-parse-application-id':
          'as90qw90uj3j9201fj90fj90dwinmfwei98f98ew0-o0c1m221dds222143',
      },
      data: dataBody,
    }

    try {
      await axios(config).then(function (response) {
        if (response.data) {
          setTaskMetadata(response.data)
        }
      })
    } catch (err) {
      toast.error('Task undefined!')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      push('/')
      console.log(err)
    }

    setIsLoading(false)
  }

  function returnContributors() {
    if (!taskMetadata.contributors || taskMetadata.contributors.length === 0) {
      return 'Empty'
    }
  }

  function formatDate(timestamp: string) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const date = new Date(Number(timestamp) * 1000)

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      console.log('search for the task info on blockchain')
      console.log(id.id)
      getTask(id.id)
    }
  }, [id])
  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading || !taskMetadata) {
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

  return (
    <>
      <HeroTask task={taskMetadata} />
      <section className="px-32 pt-[59px]">
        <div className="container  mt-12 text-[16px] font-medium !leading-[19px] text-[#000000]">
          <div className="-mx-4 flex flex-wrap items-start">
            <div className="w-full px-4">
              <div className="flex font-bold !leading-[150%]">
                <div
                  className={`px-[17px]  pb-[14px] ${
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
                  className={`mx-[57px] px-[17px]  pb-[14px] ${
                    viewOption === 'submissions'
                      ? 'border-b-[2px]  border-[#000000]'
                      : ''
                  }`}
                >
                  <p
                    onClick={() => {
                      setViewOption('submissions')
                    }}
                    className="cursor-pointer hover:text-[#353535]"
                  >
                    Applicants & submissions
                    {/* Aqui inserir o numero de updates (transactions events) que teve */}
                  </p>
                </div>
                <div
                  className={`px-[17px]  pb-[14px] ${
                    viewOption === 'updates'
                      ? 'border-b-[2px]  border-[#000000]'
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
                  <div className="mt-8 w-full text-[20px] font-normal">
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
                <div className="w-[400px] text-[#505050]">
                  <div className="shadow-lg">
                    <div className="flex h-[79px] items-center bg-[#F7F8F9] px-[30px] font-bold">
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
                    <div className="flex h-[270px] items-center px-[30px]">
                      <div>
                        <a
                          href="https://github.com/"
                          target="_blank"
                          rel="nofollow noreferrer"
                          className="border-b border-[#0354EC] font-normal text-[#0354EC]"
                        >
                          View on Github
                        </a>
                        <div className="mt-[25px]">
                          <p className="font-bold">Last Updated:</p>
                          <p>3 days ago</p>
                        </div>
                        <div className="mt-[25px]">
                          <p className="font-bold">Next meeting:</p>
                          <p>10:30 PM UTC 23-12-2021</p>
                        </div>
                        <div className="mt-[25px]">
                          <p>Reacht out to a</p>
                          <a
                            href="https://github.com/"
                            target="_blank"
                            rel="nofollow noreferrer"
                            className="border-b border-[#0354EC] text-[#0354EC]"
                          >
                            verified contributor
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[40px] shadow-lg">
                    <div className="flex h-[79px] items-center bg-[#F7F8F9] px-[30px] font-bold">
                      <p>Contributors</p>
                    </div>
                    <div className="px-[30px] py-[40px]">
                      {returnContributors()}
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
      </section>
    </>
  )
}

export default TaskView
