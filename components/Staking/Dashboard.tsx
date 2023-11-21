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
import { File, SmileySad, Info } from 'phosphor-react'

interface ModalProps {
  redirect?: string
}

const Dashboard = ({ redirect }: ModalProps) => {
  const [isLogin, setIsLogin] = useState(false)
  const { address, isConnecting, isDisconnected } = useAccount()

  return (
    <section className="px-[20px] pb-[43px] pt-[55px] text-center text-[#000]  md:px-[31px]  md:pt-[66px] lg:px-[36px] lg:pt-[77px] xl:px-[42px] xl:pt-[88px] 2xl:px-[52px] 2xl:pt-[110px]">
      <div className=" text-[15px] font-bold -tracking-[2.2%] md:text-[18px] lg:text-[21px] lg:!leading-[120%] xl:max-w-[549.6px] xl:text-[24px] 2xl:max-w-[687px] 2xl:text-[30px]">
        Thank you for being part of Openmesh Verified Contributor Community!
      </div>
      <div className="base:mt-[29px] text-[10px] font-normal md:mt-[34.8px] md:text-[12px] lg:mt-[40.6px] lg:text-[14px] xl:mt-[46.4px] xl:text-[16px] 2xl:mt-[58px] 2xl:text-[20px]">
        Your Verified Contributor ID <br></br>
        <span className="font-bold">{formatAddress(address)}</span>
      </div>
      <div className="mx-auto mt-[24px] rounded-[5px] border-[1px] border-[#D7D7D7] bg-[#FAFAFA] px-[10px] py-[2px] text-[13px] font-light shadow-[2px_2px_10px_2px_rgba(0,0,0,0.04)] md:mt-[29px] md:text-[16px] lg:mt-[34px] lg:text-[18px] xl:mt-[38px] xl:text-[21px] 2xl:mt-[48px] 2xl:w-[171px] 2xl:text-[26px]">
        0
      </div>
      <div className="mt-[7.5px] text-[6px] font-normal md:mt-[9px] md:text-[7.2px] lg:mt-[10.5px] lg:text-[8.4px] xl:mt-[12px] xl:text-[9.6px] 2xl:mt-[15px] 2xl:text-[12px]">
        Your rewards
      </div>
      <div className="mx-auto mt-[16px] w-fit cursor-pointer rounded-[5px] bg-[#000] px-[35.75px] py-[8.75px] text-[7px] font-bold text-[#fff] hover:bg-[#111111] md:mt-[19.2px] md:px-[42.9px] md:py-[10.5px] md:text-[8.4px] lg:mt-[22.4px] lg:px-[50.05px] lg:py-[12.25px] lg:text-[9.8px] xl:mt-[25.6px] xl:px-[57.2px] xl:py-[14px] xl:text-[11.2px] 2xl:mt-[32px] 2xl:px-[71.5px] 2xl:py-[17.5px] 2xl:text-[14px]">
        Stake your VCI
      </div>
      <div className="mt-[7.5px] cursor-pointer text-[6px] underline underline-offset-2 hover:text-[#141414] md:mt-[9px] md:text-[7.2px] lg:mt-[10.5px] lg:text-[8.4px] xl:mt-[12px] xl:text-[9.6px] 2xl:mt-[15px] 2xl:text-[12px]">
        Unstake
      </div>
      <div className="mt-[90px] text-left md:mt-[108px] lg:mt-[126px] xl:mt-[144px] 2xl:mt-[180px]">
        <div className="text-[8px] font-bold md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]">
          Your rewards payouts
        </div>
        <div className="mt-[17.5px] flex w-full items-center justify-center md:mt-[21px] lg:mt-[24.5px] xl:mt-[28px] 2xl:mt-[35px]">
          <SmileySad size={32} className="text-blue-500 mb-2" />
          <span className="">No rewards found</span>
        </div>
      </div>
      <div className="mt-[90px] text-left md:mt-[108px] lg:mt-[126px] xl:mt-[144px] 2xl:mt-[180px]">
        <div className="text-[8px] font-bold md:text-[9.6px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]">
          Your activities
        </div>
        <div className="mt-[17.5px] flex w-full items-center justify-center md:mt-[21px] lg:mt-[24.5px] xl:mt-[28px] 2xl:mt-[35px]">
          <SmileySad size={32} className="text-blue-500 mb-2" />
          <span className="">No activities found</span>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
