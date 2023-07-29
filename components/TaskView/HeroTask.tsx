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
import { TasksOverview } from '@/types/task'

interface TasksModalProps {
  task: TasksOverview
}

const HeroTask = ({ task }: TasksModalProps) => {
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

  // USDC, USDT AND WETH for POLYGON
  const tokensAllowedMap = {
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'usd-coin-usdc-logo',
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': 'tether-usdt-logo',
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619': 'generic-erc20',
  }

  function getTokenLogo(address: string) {
    if (tokensAllowedMap[address]) {
      return tokensAllowedMap[address]
    } else {
      return 'generic-erc20'
    }
  }

  function findGithubLink(array) {
    const item = array.find((obj) => obj.title === 'githubLink')

    if (item) {
      if (item.url.startsWith('https://')) {
        return item.url
      } else {
        return 'https://' + item.url
      }
    } else {
      return 'https://www.github.com'
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

  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <section className="border-b border-[#CFCFCF] px-32 pt-[59px] pb-[70px]">
      <div className="container text-[16px] font-medium !leading-[19px] text-[#000000]">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="flex justify-between">
              <div className="w-full">
                <h3
                  title={task.description}
                  className="mb-[50px] overflow-hidden text-ellipsis whitespace-nowrap  text-[24px] font-bold !leading-[120%]"
                >
                  {task.title}
                </h3>
                <div className="mt-[25px] flex text-[14px]  text-[#505050]">
                  <p className="">Tags: </p>
                  <div className="flex italic">
                    {task.skills &&
                      task.skills.map((skill, index) => (
                        <p
                          className="ml-1 border-b border-[#505050]"
                          key={index}
                        >
                          {skill}
                          {index !== task.skills.length - 1 && ', '}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="mt-[25px] flex text-[16px] font-medium text-[#505050]">
                  <div className="mr-[22px] flex">
                    <img
                      src="/images/task/coins.svg"
                      alt="image"
                      className={`mr-[10px] w-[22px]`}
                    />
                    <p className="mr-[3px] flex items-center">
                      Available funds:
                    </p>{' '}
                    <span className="flex items-center text-[16px] font-bold text-[#000000]">
                      ${task.estimatedBudget}
                    </span>
                  </div>

                  <div className="flex items-center text-[16px] font-normal">
                    {task.payments.map((payment, index) => (
                      <div key={index} className="flex">
                        <img
                          src={`/images/tokens/${getTokenLogo(
                            payment.tokenContract,
                          )}.svg`}
                          alt="image"
                          className={`mr-[1px] w-[22px]`}
                        />
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://mumbai.polygonscan.com/token/${payment.tokenContract}`}
                          className="mt-[2px] border-b border-[#505050] hover:text-primary"
                        >
                          {(
                            Number(payment.amount) /
                            10 ** payment.decimals
                          ).toLocaleString('en-US')}
                        </a>
                        {index < task.payments.length - 1 && (
                          <span className="mr-2">,</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-[25px] flex text-[16px] font-medium text-[#505050]">
                  <div className="mr-[50px] flex">
                    <img
                      src="/images/task/people.svg"
                      alt="image"
                      className={`mr-[10px] w-[22px]`}
                    />
                    <p className="mr-[3px] flex items-center">
                      Contributors needed:
                    </p>{' '}
                    <span className="flex items-center text-[16px] font-bold text-[#303030]">
                      {task.contributorsNeeded}
                    </span>
                  </div>
                  <div className="mr-[50px] flex">
                    <img
                      src="/images/task/clock.svg"
                      alt="image"
                      className={`mr-[10px] w-[22px]`}
                    />
                    <p className="mr-[3px] flex items-center">
                      Project length:
                    </p>{' '}
                    <span className="flex items-center text-[16px] font-bold text-[#303030]">
                      {task.projectLength}
                    </span>
                  </div>
                  <div className="mr-[10px] flex">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${findGithubLink(task.links)}`}
                      className="mr-[18px]  cursor-pointer hover:text-primary"
                    >
                      <img
                        src="/images/task/github-logo.svg"
                        alt="image"
                        className={`w-[22px]`}
                      />
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://mumbai.polygonscan.com`}
                      className="mr-[18px]  cursor-pointer hover:text-primary"
                    >
                      <img
                        src="/images/task/share-logo.svg"
                        alt="image"
                        className={`w-[22px]`}
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="w-[163px]">
                {' '}
                <div className="text-[16px] font-bold text-[#000000]">
                  <div className="flex !leading-[150%]">Status:</div>
                  <div className="mt-[6px] flex">
                    <img
                      src={`/images/task/${taskStateCircle[task.status]}`}
                      alt="image"
                      className={`mr-[10px] w-[20px]`}
                    />
                    <p className="text-[16px] font-medium text-[#303030]">
                      {task.status}
                    </p>
                  </div>
                </div>
                <div className="mt-[25px] text-[16px] font-bold !leading-[150%] text-[#000000]">
                  <p> Deadline: </p>
                  <p className="font-medium text-[#303030]">
                    {formatDate(task.deadline)}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button
                    onClick={() => {}}
                    className="h-[43px] w-full cursor-pointer rounded-[10px] bg-[#12AD50] text-[16px] font-bold text-white hover:bg-[#0b9040]"
                  >
                    Start working
                  </button>
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