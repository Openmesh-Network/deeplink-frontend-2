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
    <section className="px-32 pt-[44px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4 lg:w-2/3">
            <div>
              <div className="">
                <p className="text-[14px] font-medium !leading-[17px] text-[#505050]">
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
          <div className="w-full lg:w-1/3">
            <div className="font-regular mx-auto flex max-w-[500px] justify-end rounded-md px-4 text-right text-[14px] !leading-none text-[#000000] ">
              <div className="">
                <p className="">Available Funding</p>
                <p className="mt-[8px] text-[18px] font-bold text-[#0354EC]">
                  $151,967
                </p>
                <img
                  src="/images/tokens/tokensLogo.svg"
                  alt="image"
                  className={`ml-auto mt-[8px] w-[60px]`}
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
