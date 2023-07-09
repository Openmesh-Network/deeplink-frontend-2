/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import TasksModal from './TasksModal'
import SearchModal from './SearchModal'
import TableInfo from './tableInfo'

const TransactionList = () => {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const tasks = [
    {
      id: 1,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'Trading research',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
      categories: ['Ai', 'Blockchain', 'Science'],
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'On going',
      budget: ['500 USDC', '50 LINK'],
    },
    {
      id: 3,
      logo: '/images/carousel/blockchainLogo.svg',
      name: 'LLM development',
      description:
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Data and analytics',
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
      departaments: 'Smart-contracts and DLTs',
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
      departaments: 'Cloud and DevOps',
      submitter: '0x1f28763e7579F76620aAB20063534CF3599e2b4c',
      deadline: '210203921930',
      status: 'Open',
      budget: ['50 LINK', '700 USDC'],
    },
  ]

  const handleUpdate = () => {
    const filterTasks = () => {
      setFilteredTasks(tasks)
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
        if (departament) {
          const departamentValue = Array.isArray(departament)
            ? departament[0]
            : departament
          newFilteredTasks = newFilteredTasks.filter((task) =>
            task.categories.includes(departamentValue),
          )
        }

        const orderBy = url.searchParams.get('orderBy')
        if (orderBy === 'Oldest') {
          newFilteredTasks.sort((a, b) => a.id - b.id)
        } else if (orderBy === 'Newest') {
          newFilteredTasks.sort((a, b) => b.id - a.id)
        }

        const searchBar = url.searchParams.get('searchBar')
        if (searchBar) {
          const searchPhrase = Array.isArray(searchBar)
            ? searchBar[0]
            : searchBar // se searchBar for array, usamos o primeiro elemento
          newFilteredTasks = newFilteredTasks.filter(
            (task) =>
              task.name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
              task.description
                .toLowerCase()
                .includes(searchPhrase.toLowerCase()),
          )
        }
        setFilteredTasks(newFilteredTasks)
        setIsLoading(false)
      }
    }

    filterTasks()
  }

  useEffect(() => {
    handleUpdate()
  }, [])

  return (
    <section className="py-16 px-32 text-black md:py-20 lg:pt-32">
      <div className="container">
        <div className="mx-auto mb-10 flex justify-center text-center">
          <span className="border-b border-[#cecece] px-5 pb-2">All</span>
          <span className="border-b border-[#cecece] px-5 pb-2">
            Data and analytics
          </span>
          <span className="border-b border-[#cecece] px-5 pb-2">
            Smart-contracts and DLTs
          </span>
          <span className="border-b border-[#cecece] px-5 pb-2">
            Cloud and DevOps
          </span>
          <span className="border-b border-[#cecece] px-5 pb-2">
            Admin and Operations
          </span>
        </div>
        <SearchModal onUpdate={handleUpdate} />

        <div className="max-h-[800px] overflow-auto pr-2 text-[#000000] scrollbar-thin scrollbar-thumb-body-color">
          <div className="flex pr-1">
            <div className="-mr-[0.75px] w-[15%] border border-r-0 border-[#e8e5e5] py-1 pl-2  font-semibold">
              <span>Title</span>
            </div>
            <div className="w-[15%] border  border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
              <span>Categories</span>
            </div>
            <div className="w-[35%] border  border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
              <span>Description</span>
            </div>
            <div className="w-[10%] border border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
              <span>Author</span>
            </div>
            <div className="w-[10%] border border-r-0 border-[#e8e5e5] py-1 pl-2 font-semibold">
              <span>Status</span>
            </div>
            <div className="w-[15%] border border-[#e8e5e5] py-1 pl-2 font-semibold">
              <span>Budget</span>
            </div>
          </div>
          {filteredTasks.map((task) => (
            <TasksModal key={task.id} {...task} isLoading={false} />
          ))}
        </div>
        {/* <table className="max-h-[200px] border-collapse overflow-auto scrollbar-thin scrollbar-thumb-dark">
          <thead>
            <tr>
              <th className="border-b py-2 pl-4 pr-[80px] text-left text-xs sm:px-2">
                Title
              </th>
              <th className="border-b py-2 pl-4 pr-[45px] text-left text-xs sm:px-2">
                Categories
              </th>
              <th className="border-b py-2 pl-4 pr-[25px] text-left text-xs sm:px-2">
                Description
              </th>
              <th className="border-b py-2 pl-4 pr-[0px] text-left text-xs sm:px-2">
                Author
              </th>
              <th className="border-b py-2 pl-4 pr-[0px] text-left text-xs sm:px-2">
                Budget
              </th>
              <th className="border-b py-2 pl-4 pr-[0px] text-left text-xs sm:px-2">
                More
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <TableInfo key={task.id} {...task} isLoading={false} />
            ))}
          </tbody>
        </table> */}
      </div>
    </section>
  )
}

export default TransactionList
