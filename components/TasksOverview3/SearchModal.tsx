/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
'use client'
import { TextField, Autocomplete } from '@mui/material'
import { useState, ChangeEvent, useEffect } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Jazzicon from 'react-jazzicon'

interface ModalProps {
  onUpdate(): void
  scrollManually(): void
  openProjectsNumber: number
  activeProjectsNumber: number
  completedProjectsNumber: number
  draftProjectsNumber: number
}

type DepartamentData = {
  name: string
  tags: string[]
  funding: string
  desc: string
  img: string
  imgClassName: string
}

const SearchModal = ({
  onUpdate,
  scrollManually,
  openProjectsNumber,
  activeProjectsNumber,
  completedProjectsNumber,
  draftProjectsNumber,
}: ModalProps) => {
  const [tasksStatus, setTasksStatus] = useState('')
  const [tasksOrderBy, setTasksOrderBy] = useState('')
  const [tasksSearchBar, setTasksSearchBar] = useState('')
  const [departament, setDepartament] = useState('All')
  const [departamentSelected, setDepartamentSelected] =
    useState<DepartamentData>({
      name: 'All',
      tags: ['Data', 'Graph', 'LLM', 'Solidity', 'Rust', 'Contracts'],
      funding: '330,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: '/images/departaments/paper.svg',
      imgClassName: 'mr-1 mb-1 w-[16px]',
    })

  const pathname = usePathname()

  const statusOptions = ['open', 'active', 'completed']

  const departamentOptions = [
    {
      name: 'All',
      tags: ['Data', 'Graph', 'LLM', 'Solidity', 'Rust', 'Contracts'],
      funding: '330,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/paper.svg`,
      imgClassName: 'mr-1 mb-1 w-[16px]',
    },
    {
      name: 'Data',
      tags: ['Data', 'Graph', 'LLM'],
      funding: '11,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/data.svg`,
      imgClassName: 'mr-1 mb-1 w-[16px]',
    },
    {
      name: 'Blockchain',
      tags: ['Solidity', 'Rust', 'Contracts'],
      funding: '89,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/blockchain.svg`,
      imgClassName: 'mr-1 mb-1 w-[16px]',
    },
    {
      name: 'DevOps',
      tags: ['DevOps', 'AWS', 'Kubernets'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/cloud.svg`,
      imgClassName: 'mr-1 mb-1 w-[19px]',
    },
    {
      name: 'Cloud',
      tags: ['DevOps', 'AWS', 'Kubernets'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/cloud.svg`,
      imgClassName: 'mr-1 mb-1 w-[19px]',
    },
    {
      name: 'Cryptography & zk',
      tags: ['Cryptography', 'ZK', 'Math'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/paper.svg`,
      imgClassName: 'mr-1 mb-1 w-[19px]',
    },
    {
      name: 'Infrastructure',
      tags: ['Xnodes', 'Network', 'Topology Design'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/cloud.svg`,
      imgClassName: 'mr-1 mb-1 w-[19px]',
    },
    {
      name: 'Docs',
      tags: ['Knowledge Base', 'Documentation', 'User support'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/paper.svg`,
      imgClassName: 'mr-1 mb-1 w-[19px]',
    },
    {
      name: 'Integrations',
      tags: ['Data Integration', 'Third-Party Integration', 'Databricks'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/pointer.svg`,
      imgClassName: 'mr-1 mb-1 w-[14px]',
    },
    {
      name: 'Web App Development',
      tags: ['Dashboard', 'Gamefi', 'Real-time analytics'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/blockchain.svg`,
      imgClassName: 'mr-1 mb-1 w-[16px]',
    },
    {
      name: 'Analytics',
      tags: ['Pythia Pro', 'SQL', 'Visualization'],
      funding: '151,231',
      desc: 'Introducing the OpenR&D initiative, an open-source platform designed to empower decentralized teams to collaborate seamlessly. Simplify task management, progress tracking, and automated payouts within web3 projects, addressing the challenges faced by remote teams in the rapidly growing decentralized ecosystem.',
      img: `${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : ''
      }/images/departaments/cloud.svg`,
      imgClassName: 'mr-1 mb-1 w-[19px]',
    },
  ]
  const orderByOptions = ['Newest', 'Oldest']

  const handleStatusSelection = (value: string | null) => {
    setTasksStatus(value)
    updateUrl('status', value)
  }

  const handleOrderBySelection = (event: any, value: string | null) => {
    setTasksOrderBy(value)
    updateUrl('orderBy', value)
  }

  const handleSearchBarInput = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const value = input.value

    if (tasksSearchBar.length + value.length > 100) {
      return
    }

    setTasksSearchBar(value)

    if (value === '') {
      updateUrl('searchBar', value)
    }
  }

  const handleDepartamentSelection = (value: string) => {
    updateUrl('departament', value)
    setDepartament(value)
    // setar setDepartamentSelected() passando o departament que tem o parametro "name" igual ao value que essa func recebe
    const selectedDepartament = departamentOptions.find(
      (departament) => departament.name === value,
    )
    setDepartamentSelected(selectedDepartament)
  }

  // Função para atualizar a URL
  const updateUrl = (param: string, value: string | null) => {
    console.log('update chamado com sucesso')
    if (param !== 'page') {
      console.log('nao é page')
      if (typeof window !== 'undefined') {
        console.log('nao é page2')
        const url = new URL(window.location.href)
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
      }
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)

      if (value) {
        url.searchParams.set(param, value)
      } else {
        url.searchParams.delete(param)
      }

      window.history.pushState({}, '', url.toString())
      onUpdate()
    }
  }

  useEffect(() => {
    setDepartament('All')
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)

      const status = url.searchParams.get('status')
      if (status && statusOptions.includes(status)) setTasksStatus(status)

      const departament = url.searchParams.get('departament')
      if (departament && departament !== 'All') {
        setDepartament(departament)
      }

      const orderBy = url.searchParams.get('orderBy')
      if (orderBy && orderByOptions.includes(orderBy)) setTasksOrderBy(orderBy)

      const searchBar = url.searchParams.get('searchBar')
      if (searchBar && searchBar.length <= 100) setTasksSearchBar(searchBar)
    }
  }, [pathname])

  return (
    <section className="mt-[55px] md:mt-[48px] lg:mt-[56px] xl:mt-[64px] 2xl:mt-[80px]">
      <div className="container flex px-0">
        <div className="flex">
          <input
            type="text"
            onInput={handleSearchBarInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                updateUrl('searchBar', tasksSearchBar)
                scrollManually()
              }
            }}
            value={tasksSearchBar}
            placeholder="Search tasks, projects"
            className="mr-3 h-[35px] w-full rounded-[8px] border-[0.7px] border-[#0085FF] bg-white py-[12px] px-5 text-[14px] font-light text-[#000000] placeholder-[#9b9b9b] outline-none focus:border-primary dark:bg-opacity-10 lg:h-[44px] lg:w-[600px] lg:text-[11.2px] xl:text-[12.8px] 2xl:text-[16px]"
          />
          {/* <button
            onClick={() => {
              updateUrl('searchBar', tasksSearchBar)
              scrollManually()
            }}
            className={`flex h-[47px] w-full max-w-[37px] items-center justify-center rounded-md`}
          >
            <svg
              width="19"
              height="16"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.4062 16.8125L13.9375 12.375C14.9375 11.0625 15.5 9.46875 15.5 7.78125C15.5 5.75 14.7188 3.875 13.2812 2.4375C10.3438 -0.5 5.5625 -0.5 2.59375 2.4375C1.1875 3.84375 0.40625 5.75 0.40625 7.75C0.40625 9.78125 1.1875 11.6562 2.625 13.0937C4.09375 14.5625 6.03125 15.3125 7.96875 15.3125C9.875 15.3125 11.75 14.5938 13.2188 13.1875L18.75 17.6562C18.8438 17.75 18.9688 17.7812 19.0938 17.7812C19.25 17.7812 19.4062 17.7188 19.5312 17.5938C19.6875 17.3438 19.6562 17 19.4062 16.8125ZM3.375 12.3438C2.15625 11.125 1.5 9.5 1.5 7.75C1.5 6 2.15625 4.40625 3.40625 3.1875C4.65625 1.9375 6.3125 1.3125 7.96875 1.3125C9.625 1.3125 11.2812 1.9375 12.5312 3.1875C13.75 4.40625 14.4375 6.03125 14.4375 7.75C14.4375 9.46875 13.7188 11.125 12.5 12.3438C10 14.8438 5.90625 14.8438 3.375 12.3438Z"
                fill={`black`}
              />
            </svg>
          </button> */}
        </div>
        <div className="ml-[20px] flex items-end justify-end  text-[12px] font-medium text-white md:text-[9.6px] lg:ml-auto lg:text-[11.2px] xl:text-[13px] 2xl:text-[16px]">
          <a
            href={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? `/openrd/new-task`
                : `/new-task`
            }`}
            target="_blank"
            rel="nofollow noreferrer"
            className="ml-auto flex h-[35px] w-[100px] cursor-pointer items-center justify-center rounded-[10px] border-[0.7px] border-[#0354EC] bg-[#fff] text-[#0354EC] hover:bg-[#0354EC] hover:text-[#fff] lg:h-[43px] lg:w-[170px]"
          >
            + Add a project
          </a>
        </div>
        {/* <div className="flex">
        <Autocomplete
          value={tasksStatus}
          onChange={handleStatusSelection}
          className="ml-2  text-body-color"
          options={statusOptions}
          getOptionLabel={(option) => `${option}`}
          sx={{
            color: 'white',
            width: '150px',
          }}
          size="small"
          filterOptions={(options, state) =>
            options.filter((option) =>
              option.toLowerCase().includes(state.inputValue.toLowerCase()),
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              variant="outlined"
              id="margin-none"
              sx={{ input: { color: 'black' }, color: 'black' }}
            />
          )}
        />
        <Autocomplete
          value={tasksOrderBy}
          onChange={handleOrderBySelection}
          className="ml-2  text-body-color"
          options={orderByOptions}
          getOptionLabel={(option) => `${option}`}
          sx={{
            color: 'white',
            width: '150px',
          }}
          size="small"
          filterOptions={(options, state) =>
            options.filter((option) =>
              option.toLowerCase().includes(state.inputValue.toLowerCase()),
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sort by"
              variant="outlined"
              id="margin-none"
              sx={{ input: { color: 'black' }, color: 'black' }}
            />
          )}
        />
      </div> */}
      </div>
    </section>
  )
}

export default SearchModal
