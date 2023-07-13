/* eslint-disable react/no-unescaped-entities */
// import Image from 'next/image'
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
  writeContract,
  prepareWriteContract,
  waitForTransaction,
} from '@wagmi/core'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IPFSSubmition } from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import { BigNumberish } from 'ethers'

enum Status {
  openTasks = 0,
  takenTasks = 1,
  successfulTasks = 2,
}

const HeroTasks = () => {
  const [taskMetadata, setTaskMetadata] = useState<IPFSSubmition[] | undefined>(
    [],
  )
  const [taskStats, setTasksStats] = useState<number[]>([])

  const pathname = usePathname()

  const { push } = useRouter()

  async function getTasksStats() {
    console.log('getting task stats')
    const data = await readContract({
      address: `0x95a7CC5a3E9D16626169267780096f2C0db896E1`,
      abi: taskContractABI,
      functionName: 'taskStatistics',
    })
    if (!data) {
      toast.error(
        'Something occurred while fetching data from the smart-contract!',
      )
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    console.log('stats recebido')
    console.log(data)
    if (Array.isArray(data)) {
      const convertedData = data.map((item: BigNumberish) => Number(item))
      setTasksStats(convertedData)
    }
  }

  function truncateHash(hash) {
    const start = hash.slice(0, 5)
    const end = hash.slice(-5)
    return `${start}...${end}`
  }

  useEffect(() => {
    getTasksStats()
  }, [pathname])

  return (
    <section className="py-16 px-32 md:py-20 lg:pt-40">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4 lg:w-2/3">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1">
                <h3 className="xl:text-6xlxl mb-4 text-xl font-bold text-black sm:text-3xl lg:text-5xl">
                  Research & Development
                </h3>
                <p className="text-xs font-light !leading-tight text-black sm:text-base">
                  All-in-one platform for coordinating, displaying, and managing
                  tasks, jobs, and projects.
                </p>
                <p className="mt-4 text-xs font-light !leading-tight text-black sm:text-base">
                  We welcome all community developers to support our project.
                  You can view the desired department for project outlines,
                  budgets, deadlines, and project details. All projects are
                  recorded on a smart contract, and payments are held in escrow,
                  ensuring that developers never have to worry about not
                  receiving payment. It's similar to working for clients on
                  platforms like Upwork or Freelancer, where Upwork provides
                  support. In our case, the smart contract takes care of that.
                </p>
                <p className="mt-4 text-xs font-light !leading-tight text-black sm:text-base">
                  Tags: Smart contract, Ethereum adapters, front end, backend
                  design, documentation, running event
                </p>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/3">
            <div
              className="wow fadeInUp relative mx-auto flex max-w-[500px] justify-end rounded-md p-4 text-right text-base font-normal text-black lg:m-0"
              data-wow-delay=".15s"
            >
              <div className="mb-12">
                <p className="text-[#2F2F2F] text-sm mb-2">Available Funding</p>{' '}
                <span className="ml-1 text-4xl font-bold text-[#000000]">$1,200</span>
                <img
                  src="/images/tokens/usd-coin-usdc-logo.svg"
                  alt="image"
                  className={`w-[16px] ml-auto`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroTasks
