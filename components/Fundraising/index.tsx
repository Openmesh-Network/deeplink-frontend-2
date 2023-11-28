/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
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
import { ApplicationOffChain, Event } from '@/types/task'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import { File, SmileySad, Info } from 'phosphor-react'
import { useAccount, useNetwork } from 'wagmi'
import Fund from './Fund'
import Stats from './Stats'

type UpdatesListProps = {
  taskId: string
}

// eslint-disable-next-line prettier/prettier
const Fundraising = () => {
  const [events, setEvents] = useState<Event[] | ApplicationOffChain[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pathname = usePathname()

  const { push } = useRouter()
  const { address } = useAccount()
  const transactionsList = [
    // {
    //   id: 'string',
    //   wallet: 'string',
    //   createdAt: '02-02-2023',
    //   amount: 'string',
    //   openTokenAmount: 'string',
    //   status: 'string',
    //   validatorNodePass: 'string',
    // },
  ]

  return (
    <div className="flex justify-center pb-[10px] pt-[54.5px] md:pt-[65.4px] lg:pb-[500px] lg:pt-[76.3px] xl:pt-[87.2px] 2xl:pt-[109px]">
      <div>
        <Fund />
        <div className="base:mt-[72px] md:mt-[86.4px] lg:mt-[100.8px] xl:mt-[115.2px] 2xl:mt-[144px]">
          <Stats transactions={transactionsList} />
        </div>
      </div>
    </div>
  )

  //   return (
  //     <div className="flex justify-center pb-[10px] lg:pb-[500px]">
  //       <Dashboard />
  //     </div>
  //   )
}

export default Fundraising
