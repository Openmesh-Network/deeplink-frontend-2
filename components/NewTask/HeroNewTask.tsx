/* eslint-disable react/no-unescaped-entities */
// import Image from 'next/image'
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useContext, useEffect, useState } from 'react'
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
import { useAccount, useNetwork } from 'wagmi'
import ConnectYourWallet from '../ConnectYouWallet'
import { AccountContext } from '@/contexts/AccountContext'

const HeroNewTasks = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { user, setUser } = useContext(AccountContext)

  if (!address) {
    return <ConnectYourWallet />
  }

  if (!address && user) {
    return <div>Only web3 users can create tasks</div>
  }

  return (
    <section className="border-b border-[#CFCFCF] px-[20px] pt-[40px] pb-[43px] lg:px-[100px] lg:pt-[40px]">
      <div className="container px-[0px]">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4 lg:w-2/3">
            <div className="mb-1">
              <h3 className="text-[16px] font-bold !leading-[150%] text-[#000000] lg:text-[20px]">
                Add New Project
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroNewTasks
