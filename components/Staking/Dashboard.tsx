/* eslint-disable react/no-unescaped-entities */
// import Image from 'next/image'
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
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
import { Web3Button } from '@web3modal/react'
import Login from '../Login'
import { formatAddress } from '@/utils/functions'

interface ModalProps {
  redirect?: string
}

const Dashboard = ({ redirect }: ModalProps) => {
  const [isLogin, setIsLogin] = useState(false)
  const { address, isConnecting, isDisconnected } = useAccount()

  return (
    <section className="px-[20px] pb-[43px] pt-[55px] text-[#000]  md:px-[31px]  md:pt-[66px] lg:px-[36px] lg:pt-[77px] xl:px-[42px] xl:pt-[88px] 2xl:px-[52px] 2xl:pt-[110px]">
      <div className="text-center text-[15px] font-bold -tracking-[2.2%] md:text-[18px] lg:text-[21px] lg:!leading-[120%] xl:max-w-[549.6px] xl:text-[24px] 2xl:max-w-[687px] 2xl:text-[30px]">
        Thank you for being part of Openmesh Verified Contributor Community!
      </div>
      <div>
        Your Verified Contributor ID <br></br>
        <span className="font-bold">{formatAddress(address)}</span>
      </div>
      <div className="mt-[23px] text-center md:mt-[27.6px] lg:mt-[32.2px] xl:mt-[36.8px] 2xl:mt-[46px]">
        <Web3Button />
      </div>
    </section>
  )
}

export default Dashboard
