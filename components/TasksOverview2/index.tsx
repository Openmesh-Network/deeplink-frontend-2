/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import TasksModal from './TasksModal'
import SearchModal from './SearchModal'
import TableInfo from './tableInfo'
import { usePathname } from 'next/navigation'

const TransactionList = () => {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [departament, setDepartament] = useState('All')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const pathname = usePathname()

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
      setDepartament('All')
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
        if (departament && departament !== 'All') {
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

        // const searchBar = url.searchParams.get('searchBar')
        // if (searchBar) {
        //   const searchPhrase = Array.isArray(searchBar)
        //     ? searchBar[0]
        //     : searchBar // se searchBar for array, usamos o primeiro elemento
        //   console.log('a search bar' + searchPhrase)
        //   newFilteredTasks = newFilteredTasks.filter((task) =>
        //     task.name.toLowerCase().includes(searchPhrase),
        //   )
        //   console.log('filtro realizado')
        // }
        setFilteredTasks(newFilteredTasks)
        setIsLoading(false)
      }
    }

    filterTasks()
  }

  useEffect(() => {
    handleUpdate()
  }, [pathname])

  return (
    <section className="py-16 px-32 text-black md:py-20 lg:pt-32">
      <div className="container">
        <div className="mx-auto mb-10 flex justify-center text-center">
          <span
            onClick={() => {
              handleDepartamentSelection('All')
            }}
            className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
              departament === 'All' || !departament
                ? 'text-lg font-extrabold'
                : ''
            }`}
          >
            All
          </span>
          <span
            onClick={() => {
              handleDepartamentSelection('Data and analytics')
            }}
            className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
              departament === 'Data and analytics'
                ? 'text-lg font-extrabold'
                : ''
            }`}
          >
            Data and analytics
          </span>
          <span
            onClick={() => {
              handleDepartamentSelection('Smart-contracts and DLTs')
            }}
            className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
              departament === 'Smart-contracts and DLTs'
                ? 'text-lg font-extrabold'
                : ''
            }`}
          >
            Smart-contracts and DLTs
          </span>
          <span
            onClick={() => {
              handleDepartamentSelection('Cloud and DevOps')
            }}
            className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
              departament === 'Cloud and DevOps' ? 'text-lg font-extrabold' : ''
            }`}
          >
            Cloud and DevOps
          </span>
          <span
            onClick={() => {
              handleDepartamentSelection('Admin and Operations')
            }}
            className={`cursor-pointer border-b border-[#cecece] px-5 pb-2 hover:text-primary ${
              departament === 'Admin and Operations'
                ? 'text-lg font-extrabold'
                : ''
            }`}
          >
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
