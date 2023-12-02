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
  fundingValue?: Number
}

const Fund = ({ fundingValue }: ModalProps) => {
  const [isLogin, setIsLogin] = useState(false)
  const [isTooltip, setIsTooltip] = useState(false)
  const { address, isConnecting, isDisconnected } = useAccount()

  const ProgressBar = ({ value, max }) => {
    // Calculate width percentage
    const width = (value / max) * 100

    return (
      <div className="mx-auto h-[18px] w-[765px] rounded-full bg-[#DADBDD]">
        <div
          className="text-blue-100  h-[18px] rounded-full bg-[#1D78FF] p-0.5 text-center text-xs font-medium leading-none"
          style={{ width: `${width}%` }}
        >
          {/* {' '}
          {width}%{' '} */}
        </div>
      </div>
    )
  }

  return (
    <section className="relative px-[20px] text-center tracking-tight text-[#000] lg:!leading-[120%]">
      <div className="mx-auto w-full  text-[15px] font-bold md:text-[18px] lg:text-[21px] lg:!leading-[120%]  xl:max-w-[480px] xl:text-[24px]  2xl:max-w-[600px] 2xl:text-[30px]">
        Thank you for considering supporting Openmesh Network
      </div>
      <div className="mt-[20px] text-[10px] font-normal md:mt-[24px] md:text-[12px] lg:mt-[28px] lg:text-[14px] lg:!leading-[120%]   xl:mt-[32px] xl:text-[16px] 2xl:mt-[40px] 2xl:text-[20px]">
        Min = 0.5ETH, Max 2ETH per wallet
      </div>
      <div className="relative mx-auto mt-[3.5px] w-fit text-[9px] md:mt-[4.2px] md:text-[10.8px] lg:mt-[4.9px] lg:text-[12.6px] lg:!leading-[120%]  xl:mt-[5.6px] xl:text-[14.4px] 2xl:mt-[7px] 2xl:text-[18px]">
        <div>(2ETH will receive Genesis validator pass GVP)</div>
        <div
          onMouseEnter={() => {
            setIsTooltip(true)
          }}
          onMouseLeave={() => {
            setIsTooltip(false)
          }}
          className="absolute -top-[2px] -right-[55px] cursor-pointer text-[7px] text-[#0354EC] underline underline-offset-2 md:-right-[66px]  md:text-[8.4px] lg:-right-[77px] lg:text-[9.8px] lg:!leading-[120%] xl:-right-[88px] xl:-top-[3px] xl:text-[11.2px] 2xl:-right-[110px] 2xl:-top-[4px] 2xl:text-[14px]"
        >
          What is GVP?
        </div>
      </div>
      {isTooltip && (
        <div className="absolute -right-[20px] -top-[20px] max-w-[160px] bg-[#F5F5F5] p-[20px] text-[9px] font-normal md:-right-[20px] md:-top-[40px] md:max-w-[192px] md:text-[10.8px]  lg:-right-[25px] lg:-top-[45px] lg:max-w-[224px]   lg:text-[12.6px] lg:!leading-[120%] xl:-right-[30px] xl:-top-[50px] xl:max-w-[256px] xl:text-[14.4px] 2xl:-top-[60px] 2xl:-right-[40px] 2xl:max-w-[320px] 2xl:text-[18px]">
          Openmesh is a distributed network. To achieve this, many independent
          active validators are required. As an early support benefit, anyone
          who contributed at least 2ETH will receive a Genesis validator pass.
          This ERC721 makes you eligible to be one of the first validators of
          the network!
        </div>
      )}
      <div className="mt-[38.5px] text-[10px] font-normal md:mt-[46.2px] md:text-[12px] lg:mt-[53.9px] lg:text-[14px] xl:mt-[61.6px] xl:text-[16px] 2xl:mt-[77px] 2xl:text-[20px]">
        Openmesh Official ETH address:{' '}
        <span className="font-bold">0x6383764dbd6d5343735</span>
      </div>
      <div className="mx-auto mt-[39px] md:mt-[46.8px] lg:mt-[54.6px] xl:mt-[62.4px] 2xl:mt-[78px]">
        {ProgressBar({ value: fundingValue || 0, max: 100 })}
      </div>
      {!address ? (
        <div className="mt-[39px] md:mt-[46.8px] lg:mt-[54.6px] xl:mt-[62.4px] 2xl:mt-[78px]">
          <Web3Button />
        </div>
      ) : (
        <div className="base:py-[8.75px] mx-auto mt-[39px] w-fit cursor-pointer rounded-[5px] bg-[#0354EC] px-[20px] text-[7px] text-[#fff] hover:bg-[#053ba0] md:mt-[46.8px] md:px-[24px] md:py-[10.5px] md:text-[8.4px] lg:mt-[54.6px] lg:px-[28px] lg:py-[12.25px] lg:text-[9.8px] xl:mt-[62.4px] xl:px-[32px] xl:py-[14px] xl:text-[11.2px] 2xl:mt-[78px] 2xl:px-[40px] 2xl:py-[17.5px] 2xl:text-[14px]">
          Contribute (0.5 0 2ETH)
        </div>
      )}
    </section>
  )
}

export default Fund
