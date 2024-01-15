/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css'
import { ApplicationOffChain, Event } from '@/types/task'
import { useAccount, useNetwork } from 'wagmi'
import ConnectYourWallet from './ConnectYourWallet'
import Dashboard from './Dashboard'
import { Loader } from '../Loader/Loader'

type UpdatesListProps = {
  taskId: string
}

// eslint-disable-next-line prettier/prettier
const Staking = () => {
  const [events, setEvents] = useState<Event[] | ApplicationOffChain[]>([])
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)

  const pathname = usePathname()

  const { push } = useRouter()
  const { address } = useAccount()

  useEffect(() => {
    setIsLoadingPage(false)
  }, [address])

  if (isLoadingPage) {
    return (
      <div className="flex justify-center pb-[10px] lg:pb-[500px]">
        <Loader />
      </div>
    )
  }

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
