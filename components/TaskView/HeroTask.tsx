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
  contributorsAllowed: string[] | null
  address: string | null
}

const HeroTask = ({ task, contributorsAllowed, address }: TasksModalProps) => {
  const taskStateCircle = {
    open: 'circle-green-task-hero.svg',
    active: 'circle-blue-task-hero.svg',
    completed: 'circle-black-task-hero.svg',
  }

  const taskStatusToButton = {
    open: 'Apply now',
  }

  const taskStatusToLink = {
    open: `/application/${task.id}`,
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

  function capitalizeFirstLetter(string) {
    if (string) {
      if (string === 'active') {
        return 'On-going'
      } else {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
      }
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

  async function handleCopy() {
    const textToCopy = `https://openrd.openmesh.network/task/${task.id}`
    await navigator.clipboard.writeText(textToCopy)
    toast.success('Link copied')
  }

  return (
    <section className="border-b border-[#CFCFCF] px-[20px] pt-[40px] pb-[50px] lg:px-[100px] lg:pb-[70px] lg:pt-[59px]">
      <div className="container px-[0px] text-[12px] font-medium !leading-[19px] text-[#000000] lg:text-[16px]">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="justify-between lg:flex">
              <div className="w-full">
                <div className="mb-[35px] flex lg:mb-[50px]">
                  <h3
                    title={task.description}
                    className="mr-[15px] overflow-hidden text-ellipsis  text-[18px] font-bold !leading-[120%] lg:whitespace-nowrap lg:text-[24px]"
                  >
                    {task.title}
                  </h3>
                  {task.manager === address && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? `/openrd/edit-task/${task.id}`
                          : `/edit-task/${task.id}`
                      }`}
                      className="flex h-fit cursor-pointer items-center justify-center border-b-[1px] border-[#505050] pt-[6px] text-[11px] font-medium !leading-[19px] text-[#505050] lg:text-[14px]"
                    >
                      Edit task
                    </a>
                  )}
                </div>

                <div className="mt-[25px] flex text-[11px] text-[#505050]  lg:text-[14px]">
                  <p className="">Tags: </p>
                  <div className="flex flex-wrap gap-y-[10px] italic">
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
                <div className="mt-[25px] flex text-[12px] font-medium text-[#505050] lg:text-[16px]">
                  <div className="mr-[22px] flex">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/task/coins.svg`}
                      alt="image"
                      className={`mr-[10px] w-[22px]`}
                    />
                    <p className="mr-[3px] flex items-center">
                      Available funds:
                    </p>{' '}
                    <span className="flex items-center text-[12px] font-bold text-[#000000] lg:text-[16px]">
                      ${Number(task.estimatedBudget).toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="ml-[42px] flex">
                    Project owned by:{' '}
                    <a
                      href="https://www.openmesh.network/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="ml-[5px] text-[#0354EC] hover:text-[#033ba5]">
                        Openmesh Network
                      </p>
                    </a>
                  </div>

                  <div className="flex items-center text-[12px] font-normal lg:text-[16px]">
                    {task.payments.map((payment, index) => (
                      <div key={index} className="flex">
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }${`/images/tokens/${getTokenLogo(
                            payment.tokenContract,
                          )}.svg`}`}
                          alt="image"
                          className={`mr-[1px] w-[22px]`}
                        />
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://polygonscan.com/token/${payment.tokenContract}`}
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
                <div className="mt-[25px] text-[12px] font-medium text-[#505050] lg:flex lg:text-[16px]">
                  <div className="mr-[50px] flex">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/task/people.svg`}
                      alt="image"
                      className={`mr-[10px] w-[22px]`}
                    />
                    <p className="mr-[3px] flex items-center">
                      Contributors needed:
                    </p>{' '}
                    <span className="flex items-center text-[12px] font-bold text-[#303030] lg:text-[16px]">
                      {task.contributorsNeeded}
                    </span>
                  </div>
                  <div className="mr-[50px] mt-[25px] flex lg:mt-0">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/task/clock.svg`}
                      alt="image"
                      className={`mr-[10px] w-[22px]`}
                    />
                    <p className="mr-[3px] flex items-center">
                      Project length:
                    </p>{' '}
                    <span className="flex items-center text-[12px] font-bold text-[#303030] lg:text-[16px]">
                      {task.projectLength}
                    </span>
                  </div>
                  <div className="mr-[10px] mt-[25px] flex lg:mt-0">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      // href={`${findGithubLink(task.links)}`}
                      href="https://github.com/Openmesh-Network"
                      className="mr-[18px]  cursor-pointer hover:text-primary"
                    >
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/task/github-logo.svg`}
                        alt="image"
                        className={`w-[22px]`}
                      />
                    </a>
                    <a
                      onClick={handleCopy}
                      className="mr-[18px]  cursor-pointer hover:text-primary"
                    >
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? process.env.NEXT_PUBLIC_BASE_PATH
                            : ''
                        }/images/task/share-logo.svg`}
                        alt="image"
                        className={`w-[22px]`}
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[163px]">
                {' '}
                <div className="mt-[25px] text-[12px] font-bold text-[#000000] lg:mt-0 lg:text-[16px]">
                  <div className="flex !leading-[150%]">Status:</div>
                  <div className="mt-[6px] flex">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }${`/images/task/${taskStateCircle[task.status]}`}`}
                      alt="image"
                      className={`mr-[10px] w-[20px]`}
                    />
                    <p className="text-[12px] font-medium text-[#303030] lg:text-[16px]">
                      {capitalizeFirstLetter(task.status)}
                    </p>
                  </div>
                </div>
                <div className="mt-[25px] flex text-[12px] font-bold !leading-[150%] text-[#000000] lg:block lg:text-[16px]">
                  <p className="mr-[10px] lg:mr-0"> Deadline: </p>
                  <p className="font-medium text-[#303030]">
                    {formatDate(task.deadline)}
                  </p>
                </div>
                {task.status === 'open' && (
                  <div className="mt-[25px] ">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? `/openrd/application/${task.id}`
                          : `/application/${task.id}`
                      }`}
                      className="flex h-[43px] w-[163px] cursor-pointer items-center justify-center rounded-[10px] bg-[#12AD50] text-[12px] font-bold text-white hover:bg-[#0b9040] lg:text-[16px] "
                    >
                      {'Apply now'}
                    </a>
                  </div>
                )}
                {task.status === 'active' &&
                  contributorsAllowed &&
                  address &&
                  contributorsAllowed.includes(address) && (
                    <div className="mt-[25px] ">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${
                          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                            ? `/openrd/new-submission/${task.id}`
                            : `/new-submission/${task.id}`
                        }`}
                        className="flex h-[43px] w-[163px] cursor-pointer items-center justify-center rounded-[10px] bg-[#0354EC] text-[12px] font-bold text-white hover:bg-[#5080da] lg:text-[16px] "
                      >
                        {'Create submission'}
                      </a>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroTask
