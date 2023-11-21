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
    <section className="px-[20px] pb-[43px] pt-[55px] text-[#000]  md:px-[31px]  md:pt-[66px] lg:px-[36px] lg:pt-[77px] xl:px-[42px] xl:pt-[88px] 2xl:px-[52px] 2xl:pt-[110px]">
      <div className="text-center text-[15px] font-bold -tracking-[2.2%] md:text-[18px] lg:text-[21px] lg:!leading-[120%] xl:max-w-[549.6px] xl:text-[24px] 2xl:max-w-[687px] 2xl:text-[30px]">
        Stake your Verified Contributor NFT to earn regular rewards for your
        contribution
      </div>
      <div className="mt-[23px] text-center md:mt-[27.6px] lg:mt-[32.2px] xl:mt-[36.8px] 2xl:mt-[46px]">
        <Web3Button />
      </div>
      <div className="mt-[17px] text-center text-[7px] font-medium text-[#505050] md:mt-[20.4px] md:text-[8.4px] lg:mt-[23.8px] lg:text-[9.8px] xl:mt-[27.2px] xl:max-w-[515.2px] xl:text-[11.2px] 2xl:mt-[34px] 2xl:max-w-[644px] 2xl:text-[14px]">
        Staking in OpenR&D allows Verified Contributors to stake their unique
        NFTs, symbolizing their valued membership and expertise. This process
        not only reflects their commitment to the ecosystem but also entitles
        them to earn regular Openmesh tokens as rewards, acknowledging and
        appreciating their continuous contributions to the platform.
      </div>
      <div className="xl:max-w-[520px] 2xl:max-w-[650px]">
        <img
          src="/images/staking/verified.svg"
          alt="image"
          className={`mt-[106.5px] w-[166px] md:mt-[127.8px] md:w-[199.2px] lg:mt-[149.1px] lg:w-[232.4px] xl:mt-[170.4px] xl:w-[265.6px] 2xl:mt-[213px] 2xl:w-[332px]`}
        />
        <div className="mt-[39px] md:mt-[46.8px] lg:mt-[54.6px] xl:mt-[62.4px] 2xl:mt-[78px]">
          <div className="text-[9px] font-bold md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            Verified contributors
          </div>
          <div className="mt-[10px] text-[7px] font-medium text-[#505050] md:text-[8.4px] lg:text-[9.8px] xl:text-[11.2px] 2xl:mt-[12px] 2xl:text-[14px]">
            Verified contributors are individuals or groups of individuals that
            contribute to a protocol as core developers and researchers with
            technical knowledge and expertise in the fields of blockchain, data,
            cybersecurity, cloud technologies, etc, and are vetted by a DAO
            community.
          </div>
        </div>
        <div className="mt-[26.5px] md:mt-[31.8px] lg:mt-[37.1px] xl:mt-[42.4px] 2xl:mt-[53px]">
          <div className="text-[9px] font-bold md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            How to become a Verified Contributor?{' '}
          </div>
          <div className="mt-[10px] text-[7px] font-medium text-[#505050] md:text-[8.4px] lg:text-[9.8px] xl:text-[11.2px] 2xl:mt-[12px] 2xl:text-[14px]">
            Create your profile at OpenR&D and fill out the application form.
            Full guide here
          </div>
        </div>
        <div className="mt-[20px] md:mt-[24px] lg:mt-[28px] xl:mt-[32px] 2xl:mt-[40px]">
          <div className="text-[9px] font-bold md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            What are the responsibilities of a Verified Contributor?{' '}
          </div>
          <div className="mt-[10px] text-[7px] font-medium text-[#505050] md:text-[8.4px] lg:text-[9.8px] xl:text-[11.2px] 2xl:mt-[12px] 2xl:text-[14px]">
            <div>
              Being a Verified Contributor will enable you to create projects,
              vote, nominate, and edit.
            </div>
            <div className="pl-[3px]">
              <div className="flex gap-x-[5px]">
                <div>1.</div>
                <div>
                  Create projects - You can add a project simply by entering the
                  "Add a Project" form where you can set the project scope,
                  details, funding, deadline, and estimated contributors needed.
                  Once a project is created, it will be categorized as "Draft"
                  status where it waits for approval by other Verified
                  Contributors.
                </div>
              </div>
              <div className="flex gap-x-[5px] xl:mt-[10px] 2xl:mt-[12px]">
                <div>2.</div>
                <div>
                  Approve projects - You can browse "Draft" projects and browse
                  through the project details and their requirements. If you
                  think that the projects proposed are beneficial for the
                  protocol development, you can approve the projects to make it
                  "Open" for applications.
                </div>
              </div>
              <div className="flex gap-x-[5px] xl:mt-[10px] 2xl:mt-[12px]">
                <div>3.</div>
                <div>
                  Nominate applicants - As applicants submit their bid in
                  completing projects, you can browse through their profile to
                  evaluate their qualifications and nominate them to take on the
                  tasks.
                </div>
              </div>
              <div className="flex gap-x-[5px] xl:mt-[10px] 2xl:mt-[12px]">
                <div>4.</div>
                <div>
                  Label projects as completed - When applicants have finished
                  and submit their projects by the deadline, you will have the
                  ability to label them as completed if the requirements are
                  met.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[24.5px] md:mt-[29.4px] lg:mt-[34.3px] xl:mt-[39.2px] 2xl:mt-[49px]">
          <div className="text-[9px] font-bold md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            How does the OpenR&D protocol know that I am a Verified Contributor?{' '}
          </div>
          <div className="mt-[10px] text-[7px] font-medium text-[#505050] md:text-[8.4px] lg:text-[9.8px] xl:text-[11.2px] 2xl:mt-[12px] 2xl:text-[14px]">
            Verified contributors who are approved will be minted an ERC-721
            token which will be checked during interactions with the OpenR&D
            platform.
          </div>
        </div>
        <div className="mt-[26.5px] md:mt-[31.8px] lg:mt-[37.1px] xl:mt-[42.4px] 2xl:mt-[53px]">
          <div className="text-[9px] font-bold md:text-[10.8px] lg:text-[12.6px] xl:text-[14.4px] 2xl:text-[18px]">
            How does the OpenR&D protocol know that I am a Verified Contributor?{' '}
          </div>
          <div className="mt-[10px] text-[7px] font-medium text-[#505050] md:text-[8.4px] lg:text-[9.8px] xl:text-[11.2px] 2xl:mt-[12px] 2xl:text-[14px]">
            Verified contributors who are approved will be minted an ERC-721
            token which will be checked during interactions with the OpenR&D
            platform.
          </div>
        </div>
        <div className="mt-[18px] md:mt-[21.6px] lg:mt-[25.2px] xl:mt-[28.8px] 2xl:mt-[36px]">
          <a
            href="https://open-mesh.gitbook.io/l3a-dao-documentation/verified-contributor-guide/apply-as-verified-contributor"
            target="_blank"
            rel="noreferrer"
          >
            <div className="font-regular base:text-[7px] text-[#0354EC] underline underline-offset-2 md:text-[8.4px] lg:text-[9.8px] xl:text-[11.2px] 2xl:text-[14px]">
              Read full documentation
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ConnectYourWallet
