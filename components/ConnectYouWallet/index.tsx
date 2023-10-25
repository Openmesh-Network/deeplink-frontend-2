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

const ConnectYourWallet = ({ redirect }: ModalProps) => {
  const [isLogin, setIsLogin] = useState(false)
  const { address, isConnecting, isDisconnected } = useAccount()

  return (
    <section className="px-[20px] pb-[43px] text-[#000] md:px-[31px]  lg:px-[36px]  xl:px-[42px] 2xl:px-[52px] ">
      <div className="md:flex">
        <div className="mr-[30px] max-w-[434px] pt-[40px] md:mr-[35.5px] md:pt-[64px] lg:mr-[41px] lg:pt-[75px] xl:mr-[47px] xl:pt-[85px] 2xl:mr-[59px] 2xl:pt-[107px]">
          <div className="text-[15px] font-bold -tracking-[2.2%] md:text-[18px] lg:text-[21px] lg:!leading-[120%] xl:text-[24px] 2xl:text-[30px]">
            Connect your wallet to continue
          </div>
          <div className="mt-[20px] text-[7px] font-light text-[#505050] md:mt-[24px] md:text-[8.4px] lg:mt-[28px] lg:text-[10px] lg:!leading-[150%] xl:mt-[32px] xl:text-[11.2px] 2xl:mt-[40px] 2xl:text-[14px] ">
            Integrate APIs from different exchanges, allowing seamless data flow
            on the L3A platform. Conduct
          </div>
          <div className="mt-[20px] md:mt-[24px] lg:mt-[28px] xl:mt-[32px] 2xl:mt-[40px]">
            <Web3Button />
          </div>
        </div>
        <div className="mt-[20px] mr-[50px] hidden h-[309px] w-[1px] bg-[#E3E3E3] md:mt-[40px] md:mr-[60px] md:block lg:mt-[46px] lg:mr-[70px] xl:mt-[53px] xl:mr-[80px] 2xl:mt-[66px] 2xl:mr-[100px]"></div>
        <div className="pt-[38px] text-[8px] font-bold -tracking-[2.2%] md:pt-[81px] md:text-[9.6px] lg:pt-[95px] lg:text-[11.2px] lg:!leading-[150%] xl:pt-[109px] xl:text-[12.8px] 2xl:pt-[136px] 2xl:text-[16px]">
          {isLogin ? (
            <div>
              {' '}
              <Login />
            </div>
          ) : (
            <div>
              <div className="text-[10px] font-normal md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
                Not a web3 user?
              </div>
              <div className="mt-[24px] md:mt-[24px] lg:mt-[24px] xl:mt-[24px] 2xl:mt-[24px]">
                <a>
                  <div
                    onClick={() => setIsLogin(true)}
                    className="cursor-pointer rounded-[5px] bg-[#0055E7] px-[16px] py-[6px] text-[#fff] hover:bg-[#0247c0] md:px-[20px] md:py-[7.2px] lg:px-[22.4px] lg:py-[8.4px] xl:px-[25.5px] xl:py-[9.5px] 2xl:px-[32px] 2xl:py-[12px]"
                  >
                    Openmesh Expert Login
                  </div>
                </a>
              </div>
              <div className="mt-[12px] md:mt-[14.5px] lg:mt-[17px] xl:mt-[19.2px] 2xl:mt-[24px]">
                <a
                  href={`${redirect || 'https://www.openmesh.network/oen'}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="cursor-pointer rounded-[5px] border-[1px] border-[#0354EC] bg-[#fff] px-[45px] py-[6px] text-[#0354EC] hover:bg-[#0247c0] hover:text-[#fff] md:px-[53.4px] md:py-[7.2px] lg:px-[62.3px] lg:py-[8.4px] xl:px-[71.2px] xl:py-[9.5px] 2xl:px-[89px] 2xl:py-[12px]">
                    Register
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ConnectYourWallet
