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
  updatesProjectsNumber: number
}

type DepartamentData = {
  name: string
  tags: string[]
  funding: string
  desc: string
  img: string
  imgClassName: string
}

const FilterModal = ({
  onUpdate,
  scrollManually,
  openProjectsNumber,
  activeProjectsNumber,
  updatesProjectsNumber,
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
      desc: 'Introducing Pythia - our revolutionary, open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto. open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto.',
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
      desc: 'Introducing Pythia - our revolutionary, open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto. open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto.',
      img: '/images/departaments/paper.svg',
      imgClassName: 'mr-1 mb-1 w-[16px]',
    },
    {
      name: 'Data',
      tags: ['Data', 'Graph', 'LLM'],
      funding: '11,231',
      desc: 'Introducing Pythia - our revolutionary, open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto. open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto.',
      img: '/images/departaments/data.svg',
      imgClassName: 'mr-1 mb-1 w-[16px]',
    },
    {
      name: 'Blockchain',
      tags: ['Solidity', 'Rust', 'Contracts'],
      funding: '89,231',
      desc: 'Introducing Pythia - our revolutionary, open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto. open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto.',
      img: '/images/departaments/blockchain.svg',
      imgClassName: 'mr-1 mb-1 w-[16px]',
    },
    {
      name: 'Cloud',
      tags: ['DevOps', 'AWS', 'Kubernets'],
      funding: '151,231',
      desc: 'Introducing Pythia - our revolutionary, open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto. open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto.',
      img: '/images/departaments/cloud.svg',
      imgClassName: 'mr-1 mb-1 w-[19px]',
    },
    {
      name: 'Frontend',
      tags: ['Web', 'Mobile', 'Desktop'],
      funding: '51,231',
      desc: 'Introducing Pythia - our revolutionary, open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto. open-source Web3 data search and product development platform. With Pythia, anyone can easily search, design, build, and store their own crypto.',
      img: '/images/departaments/pointer.svg',
      imgClassName: 'mr-1 mb-1 w-[13px]',
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
    <section className="mt-[46px] px-32">
      <div className="container">
        <div className="flex text-[#000000]">
          <div
            onClick={() => {
              handleStatusSelection('open')
            }}
            className={`mx-4 flex h-[95px] w-1/3 cursor-pointer items-center rounded-[10px] border border-[#D4D4D4] px-9 hover:bg-[#000000] hover:text-white ${
              tasksStatus === 'open' ? 'border-0 bg-[#000000] text-white' : ''
            }`}
          >
            <div className="">
              <p className="text-[18px] font-bold">Open Projects</p>
              <p className="-mb-1 text-[32px] font-bold">
                {openProjectsNumber}
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              handleStatusSelection('active')
            }}
            className={`mx-4 flex h-[95px] w-1/3 cursor-pointer items-center rounded-[10px] border border-[#D4D4D4] px-9 hover:bg-[#000000] hover:text-white ${
              tasksStatus === 'active' ? 'border-0 bg-[#000000] text-white' : ''
            }`}
          >
            <div className="">
              <p className="text-[18px] font-bold">Active Projects</p>
              <p className="-mb-1 text-[32px] font-bold">
                {activeProjectsNumber}
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              handleStatusSelection('update')
            }}
            className={`mx-4 flex h-[95px] w-1/3 cursor-pointer items-center rounded-[10px] border border-[#D4D4D4] px-9 hover:bg-[#000000] hover:text-white ${
              tasksStatus === 'update' ? 'border-0 bg-[#000000] text-white' : ''
            }`}
          >
            <div className="">
              <p className="text-[18px] font-bold">Updates</p>
              <p className="-mb-1 text-[32px] font-bold">
                {updatesProjectsNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FilterModal
