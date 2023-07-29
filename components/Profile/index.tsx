/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, useCallback } from 'react'
import TasksModal from './ProfileTransactionModal'
import SearchModal from './SearchModal'
import { usePathname } from 'next/navigation'
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

const TransactionList = () => {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [departament, setDepartament] = useState('All')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const pathname = usePathname()
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: ensName } = useEnsName()

  const tasks = [
    {
      id: 1,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Trading research',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Ai', 'Blockchain', 'Science'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['250 USDT'],
    },
    {
      id: 2,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Create a website for a social media plataform',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Frontend', 'Blockchain'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'On going',
      budget: ['500 USDC', '50 LINK'],
    },
    {
      id: 3,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'LLM development',
      departament:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Ai'],
      departaments: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['500 USDC', '50 LINK', '700 USDC'],
    },
    {
      id: 4,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Crypto research',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Blockchain'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Finished',
      budget: ['1500 USDC', '50 LINK', '700 USDC'],
    },
    {
      id: 5,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Rust backend development',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Backend', 'Blockchain'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['500 USDC', '50 LINK'],
    },
    {
      id: 6,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'LLM development',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Ai'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Finished',
      budget: ['500 USDC', '50 LINK', '700 USDC'],
    },
    {
      id: 7,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
    {
      id: 8,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
    {
      id: 9,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
    {
      id: 10,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
    {
      id: 11,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
    {
      id: 12,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
    {
      id: 13,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Smart-contracts and DLTs',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
    {
      id: 14,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Marketing managment',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Community'],
      departament: 'Cloud and DevOps',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
  ]

  const handleDepartamentSelection = (value: string) => {
    updateUrl('departament', value)
  }

  // Função para atualizar a URL
  const updateUrl = (param: string, value: string | null) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)

      if (value) {
        url.searchParams.set(param, value)
      } else {
        url.searchParams.delete(param)
      }

      window.history.pushState({}, '', url.toString())
      handleUpdate()
    }
  }

  const handleUpdate = () => {
    const filterTasks = () => {
      setFilteredTasks(tasks)
      setDepartament('My tasks')
      // setIsLoading(true)
      let newFilteredTasks = tasks
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)

        const status = url.searchParams.get('status')
        if (status) {
          newFilteredTasks = newFilteredTasks.filter(
            (task) => task.status === status,
          )
        }

        const departament = url.searchParams.get('departament')
        if (departament && departament !== 'My tasks') {
          const departamentValue = Array.isArray(departament)
            ? departament[0]
            : departament
          newFilteredTasks = newFilteredTasks.filter((task) =>
            task.departament.includes(departamentValue),
          )
          setDepartament(departament)
        }

        const orderBy = url.searchParams.get('orderBy')
        if (orderBy === 'Oldest') {
          newFilteredTasks.sort((a, b) => a.id - b.id)
        } else if (orderBy === 'Newest') {
          newFilteredTasks.sort((a, b) => b.id - a.id)
        }

        setFilteredTasks(newFilteredTasks)
        setIsLoading(false)
      }
    }

    filterTasks()
  }

  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const scrollManually = () => {
    const taskStartElement = document.getElementById('taskStart')
    taskStartElement.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCopyClick = useCallback(() => {
    // Usar API de clipboard para copiar o endereço
    navigator.clipboard.writeText(address)
    // mensagem de erro
  }, [address])

  useEffect(() => {
    handleUpdate()
  }, [pathname])

  return (
    <>
      {address ? (
        <>
          <section className="border-b border-[#CFCFCF] px-32 pb-[46px] pt-[116px] text-[18px] font-medium text-[#505050]">
            <div className="container">
              <div className="mb-1 ml-[70px] w-fit">
                <span className="cursor-pointer border-b-[1px] border-[#505050]">
                  Edit Profile
                </span>
              </div>
              <div className="mt-[12px] flex">
                <div className="flex cursor-pointer items-center">
                  <Jazzicon diameter={50} seed={jsNumberForAddress(address)} />
                </div>
                <div
                  title={address}
                  className="mr-4 ml-[20px] flex items-center text-[30px] font-bold text-[#D4D4D4]"
                >
                  {ensName || formatAddress(address)}
                </div>
                <div
                  onClick={handleCopyClick}
                  className="flex cursor-pointer items-center"
                >
                  <img
                    src={`/images/profile/copy.svg`}
                    alt="image"
                    className={`w-[17.5px]`}
                  />
                </div>
                <div className="ml-auto flex cursor-pointer items-center  justify-end">
                  <a className="flex w-[217px] justify-center rounded-[5px] bg-[#12AD50] py-1 text-[16px] font-bold  text-white hover:bg-[#0e7a39]">
                    <img
                      src={`/images/profile/check.svg`}
                      alt="image"
                      className={`mr-2 w-[20.11px]`}
                    />
                    <span className="">Verified Contributor</span>
                  </a>
                </div>
              </div>
              <div className="mt-[21px] ml-[70px]">
                <p>Tags</p>
              </div>
              <div className="mt-[34px] ml-[70px] flex">
                <div className="flex">
                  <div className="mr-[60px] flex">
                    <img
                      src={`/images/profile/clock.svg`}
                      alt="image"
                      className={`mr-2 w-[18px]`}
                    />
                    <span className="flex items-center">
                      Contributor since:{' '}
                      <span className="ml-1 font-bold text-[#303030]">
                        12 Jul 2023
                      </span>
                    </span>
                  </div>
                  <div className="mr-[60px] flex">
                    <img
                      src={`/images/profile/coins.svg`}
                      alt="image"
                      className={`mr-2 w-[18px]`}
                    />
                    <span className="flex items-center">Total earned:</span>
                  </div>
                  <div className="mr-[60px] flex">
                    <img
                      src={`/images/profile/people.svg`}
                      alt="image"
                      className={`mr-2 w-[18px]`}
                    />
                    <span className="flex items-center">Job success:</span>
                  </div>
                </div>
                <div className="ml-auto flex w-[107px] justify-between">
                  <div className="flex items-center">
                    <img
                      src={`/images/profile/github.svg`}
                      alt="image"
                      className={`w-[24.2px]`}
                    />
                  </div>
                  <div className="flex items-center">
                    <img
                      src={`/images/profile/twitter.svg`}
                      alt="image"
                      className={`w-[25px]`}
                    />
                  </div>
                  <div className="flex items-center">
                    <img
                      src={`/images/profile/share.svg`}
                      alt="image"
                      className={`w-[21.88px]`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <FilterModal
            onUpdate={handleUpdate}
            scrollManually={scrollManually}
            openProjectsNumber={2}
            activeProjectsNumber={3}
            updatesProjectsNumber={1}
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
      ) : (
        <section className="flex items-center justify-center py-16 px-32 pb-56 text-black md:py-20 lg:pt-40">
          <h1 className="pb-96 ">Please connect your wallet</h1>
        </section>
      )}
    </>
  )
}

export default TransactionList
