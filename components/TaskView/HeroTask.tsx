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

interface TasksModalProps {
  task: IPFSSubmition
}

const HeroTask = ({ task }: TasksModalProps) => {
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition>()
  const [transactionCount, setTransactionCount] = useState<number>(0)

  const taskStateCircle = {
    open: 'circle-green-task.svg',
    taken: 'circle-yellow-task.svg',
    closed: 'circle-gray-task.svg',
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
    // updating the state with the modified copy
    setTaskMetadata((prevState) => ({ ...prevState, payments: newPayments }))
  }

  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <section className="border-b border-[#CFCFCF]   px-32 pt-[59px] pb-[43px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1 flex justify-between">
                <div className="w-4/5">
                  <h3 className="mb-4 text-[30px] font-bold">{task.title}</h3>
                  <p
                    title={task.description}
                    className="overflow-hidden text-[24px] font-medium !leading-tight text-[#505050] line-clamp-3"
                  >
                    {task.description}
                  </p>
                  <div className="mt-10 flex text-[20px] font-medium text-[#505050]">
                    <p>Available funds</p>{' '}
                    <div className="ml-4 mt-1 flex max-w-xl items-start justify-start px-2">
                      {task.payments.map((payment, index) => (
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
                          {index < task.payments.length - 1 && (
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
                      src={`/images/task/${
                        taskStateCircle[taskMetadata.status]
                      }`}
                      alt="image"
                      className={`w-[34px]`}
                    />
                    <p className="">Status: {taskMetadata.status}</p>
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
    </section>
  )
}

export default HeroTask
