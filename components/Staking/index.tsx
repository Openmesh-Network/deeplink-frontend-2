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
import ConnectYourWallet from './ConnectYourWallet'
import Dashboard from './Dashboard'

type UpdatesListProps = {
  taskId: string
}

// eslint-disable-next-line prettier/prettier
const Staking = () => {
  const [events, setEvents] = useState<Event[] | ApplicationOffChain[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pathname = usePathname()

  const { push } = useRouter()
  const { address } = useAccount()

  if (!address) {
    return (
      <div className="flex justify-center pb-[10px] lg:pb-[500px]">
        <ConnectYourWallet />
      </div>
    )
  }

  return (
    <div className="flex justify-center pb-[10px] lg:pb-[500px]">
      <Dashboard />
    </div>
  )
}

export default Staking
