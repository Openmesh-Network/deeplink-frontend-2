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

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  async function getTasksStats() {
    console.log('getting task stats')
    const data = await readContract({
      address: `0x${taskAddress.substring(2)}`,
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
    <section className="border-b border-[#9b9a9a] py-16 px-32 md:py-10 lg:pt-40">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4 lg:w-2/3">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1">
                <h3 className="xl:text-6xlxl mb-4 text-xl font-bold text-[#000000] sm:text-2xl lg:text-4xl">
                  Open Research & Development
                </h3>
                <p className="mt-4 text-xs font-medium !leading-normal text-[#505050] sm:text-xl">
                  Introducing Pythia - our revolutionary, open-source Web3 data
                  search and product development platform. With Pythia, anyone
                  can easily search, design, build, and store their own crypto
                  and Web3 data products directly within their wallet, just like
                  ERC20 assets. Pythia Search functions like Google, allowing
                  you to ask anything and get answers instantly.
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
                <p className="mb-2 text-sm text-[#2F2F2F]">Available Funding</p>{' '}
                <span className="ml-1 text-4xl font-bold text-[#000000]">
                  $1,200
                </span>
                <img
                  src="/images/tokens/usd-coin-usdc-logo.svg"
                  alt="image"
                  className={`ml-auto w-[16px]`}
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
