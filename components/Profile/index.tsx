/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, useCallback } from 'react'
import TasksModal from './ProfileTransactionModal'
import SearchModal from './SearchModal'
import { usePathname, useRouter } from 'next/navigation'
import {
  UserOutlined,
  CopyOutlined,
  CheckOutlined,
  ClockCircleFilled,
} from '@ant-design/icons'
import { useAccount, useNetwork, useEnsName } from 'wagmi'
import {
  readContract,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
} from '@wagmi/core'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import FilterModal from './FilterModal'
import { User } from '@/types/user'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import HeroUser from './HeroUser'

const ProfileView = (id: any) => {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [departament, setDepartament] = useState('All')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<User | null>()
  const [userInvalidAddress, setUserInvalidAddress] = useState<boolean>()

  const { push } = useRouter()

  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: ensName } = useEnsName()
  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  async function getUser(id: any) {
    if (!ethers.isAddress(id)) {
      setUserInvalidAddress(true)
      setIsLoading(false)
      return
    }
    const dataBody = {
      id,
    }
    setIsLoading(true)
    const config = {
      method: 'post' as 'post',
      url: `https://dpl-backend-homolog.up.railway.app/functions/getTask`,
      headers: {
        'x-parse-application-id':
          'as90qw90uj3j9201fj90fj90dwinmfwei98f98ew0-o0c1m221dds222143',
      },
      data: dataBody,
    }

    try {
      await axios(config).then(function (response) {
        setUserProfile(response.data)
        setIsLoading(false)
      })
    } catch (err) {
      toast.error('Error getting the user info!')
      console.log(err)
    }

    setIsLoading(false)
  }

  const scrollManually = () => {
    const taskStartElement = document.getElementById('taskStart')
    taskStartElement.scrollIntoView({ behavior: 'smooth' })
  }

  function handleUpdate() {}

  const handleCopyClick = useCallback(() => {
    // Usar API de clipboard para copiar o endereço
    navigator.clipboard.writeText(address)
    // mensagem de erro
  }, [address])

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      console.log('search for the task info on blockchain')
      console.log(id.id)
      getUser(id.id)
    } else if (address) {
      push(`/application/${address}`)
    }
  }, [id])

  if (!isLoading && userInvalidAddress) {
    return (
      <section className="border-b border-[#CFCFCF] px-32 pb-[700px] pt-[116px] text-[18px] font-medium text-[#505050]">
        <div className="flex justify-center">Invalid address</div>
      </section>
    )
  }
  return (
    <>
      <HeroUser user={userProfile} id={id.id} ensName={ensName} />
      <FilterModal
        onUpdate={handleUpdate}
        scrollManually={scrollManually}
        openProjectsNumber={2}
        activeProjectsNumber={3}
        completedProjectsNumber={1}
      />
      <section className="px-32" id={'taskStart'}>
        <div className="container">
          {/* <div className="pr-2 text-[#000000]">
                <div className="mb-14 flex items-start justify-between text-[18px] font-bold">
                  <div className="mr-4 flex w-[35%] items-center">
                    <p
                      onClick={() => {
                        console.log('as tasks')
                        console.log(finalTasks)
                        console.log('filtered tasks')
                        console.log(filteredTasks)
                      }}
                      className="pr-2"
                    >
                      Project
                    </p>
                  </div>
                  <div className="flex w-[15%] items-center">
                    <p className="pr-2">Dept/Tags</p>
                  </div>
                  <div className="flex w-[10%] items-center">
                    <p className="pr-2">Budget</p>
                    <img
                  src="/images/task/vectorDown.svg"
                  alt="image"
                  className={`w-[14px]`}
                />
                  </div>
                  <div className="flex w-[8%] items-center">
                    <p className="pr-2">Ends</p>
                    <svg
                      onClick={handleOrderByDeadlineSelection}
                      className={`w-[14px] cursor-pointer  ${
                        orderByDeadline === 'oldest'
                          ? 'rotate-180 transform'
                          : ''
                      }`}
                      viewBox="0 0 16 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.15474 9.65876L0.35261 3.07599C-0.117537 2.62101 -0.117537 1.88529 0.35261 1.43514L1.48296 0.341239C1.95311 -0.113746 2.71335 -0.113746 3.17849 0.341239L8 5.00726L12.8215 0.341239C13.2917 -0.113746 14.0519 -0.113746 14.517 0.341239L15.6474 1.43514C16.1175 1.89013 16.1175 2.62585 15.6474 3.07599L8.84526 9.65876C8.38512 10.1137 7.62488 10.1137 7.15474 9.65876Z"
                        fill="#959595"
                      />
                    </svg>
                  </div>
                  <div className="w-[12%]"></div>
                </div>
                {isLoading && (
                  <>
                    <div className="flex h-32 animate-pulse pb-12">
                      <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
                      <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
                    </div>
                    <div className="flex h-32 animate-pulse pb-12">
                      <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
                      <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
                    </div>
                    <div className="flex h-32 animate-pulse pb-12">
                      <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
                      <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
                    </div>
                  </>
                )}
                {!isLoading && finalTasks.length === 0 && <NoTasks />}
                {!isLoading &&
                  finalTasks.length > 0 &&
                  finalTasks.map((task) => (
                    <TasksModal key={task.id} task={task} isLoading={false} />
                  ))}
                {!isLoading && finalTasks.length > 0 && pagination && (
                  <div className="flex items-center justify-center pt-16 pb-2 text-[18px] font-normal">
                    {pagination.currentPage !== 1 && (
                      <p
                        onClick={handlePaginationSelectionPrev}
                        className="cursor-pointer hover:text-[#1068E6]"
                      >
                        Prev
                      </p>
                    )}
                    <p className="mx-14">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    {pagination.totalPages > pagination.currentPage && (
                      <p
                        onClick={handlePaginationSelectionNext}
                        className="cursor-pointer hover:text-[#1068E6]"
                      >
                        Next
                      </p>
                    )}
                  </div>
                )}
              </div> */}
        </div>
      </section>
    </>
  )
}

export default ProfileView
