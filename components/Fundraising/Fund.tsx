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

interface ModalProps {
  redirect?: string
}

const Fund = ({ redirect }: ModalProps) => {
  const [isLogin, setIsLogin] = useState(false)
  const [isTooltip, setIsTooltip] = useState(false)
  const { address, isConnecting, isDisconnected } = useAccount()

  return (
    <section className="relative text-center tracking-tight text-[#000] lg:!leading-[120%]">
      <div className="w-full px-[20px] text-[15px] font-bold md:text-[18px] lg:text-[21px] lg:!leading-[120%]  xl:max-w-[480px] xl:text-[24px]  2xl:max-w-[600px] 2xl:text-[30px]">
        Thank you for considering supporting Openmesh Network
      </div>
      <div className="mt-[20px] text-[10px] font-normal md:mt-[24px] md:text-[12px] lg:mt-[28px] lg:text-[14px] lg:!leading-[120%]   xl:mt-[32px] xl:text-[16px] 2xl:mt-[40px] 2xl:text-[20px]">
        Min = 0.5ETH, Max 2ETH per wallet
      </div>
      <div className="relative mt-[3.5px] text-[9px] md:mt-[4.2px] md:text-[10.8px] lg:mt-[4.9px] lg:text-[12.6px] lg:!leading-[120%]  xl:mt-[5.6px] xl:text-[14.4px] 2xl:mt-[7px] 2xl:text-[18px]">
        <div>(2ETH will receive Genesis validator pass GVP)</div>
        <div
          onMouseEnter={() => {
            setIsTooltip(true)
          }}
          onMouseLeave={() => {
            setIsTooltip(false)
          }}
          className="absolute -top-[2px] right-0 cursor-pointer text-[7px]  text-[#0354EC] underline underline-offset-2 md:text-[8.4px] lg:text-[9.8px] lg:!leading-[120%] xl:-top-[3px] xl:text-[11.2px] 2xl:-top-[4px] 2xl:text-[14px]"
        >
          What is GVP?
        </div>
      </div>
      {isTooltip && (
        <div className="absolute -top-[55px] -right-[170px] max-w-[160px] bg-[#F5F5F5] p-[20px] text-[9px] font-normal md:-top-[66px] md:-right-[204px] md:max-w-[192px] md:text-[10.8px] lg:-top-[77px] lg:-right-[238px]  lg:max-w-[224px] lg:text-[12.6px] lg:!leading-[120%] xl:-top-[88px] xl:-right-[272px] xl:max-w-[256px] xl:text-[14.4px] 2xl:-top-[110px] 2xl:-right-[340px] 2xl:max-w-[320px] 2xl:text-[18px]">
          Openmesh is a distributed network. To achieve this, many independent
          active validators are required. As an early support benefit, anyone
          who contributed at least 2ETH will receive a Genesis validator pass.
          This ERC721 makes you eligible to be one of the first validators of
          the network!
        </div>
      )}
    </section>
  )
}

export default Fund
