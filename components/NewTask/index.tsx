/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, ChangeEvent, FC } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import taskContractABI from '@/utils/abi/taskContractABI.json'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import { Link, Contributor } from '@/types/task'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { TextField, Autocomplete } from '@mui/material'
import { ethers, isAddress } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import {
  readContract,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
  watchContractEvent,
} from '@wagmi/core'
import HeroNewTasks from './HeroNewTask'

type TaskSubmitForm = {
  title: string
  description: string
  deadline: Date
  departament: string
  skills: string[]
  type: string
  projectLength: string
  numberOfApplicants: string
  githubLink: string
  calendarLink: string
  reachOutLink: string
}

type Payment = {
  tokenContract: string
  amount: string
}

type FileListProps = {
  files: File[]
  onRemove(index: number): void
}

type IPFSSubmition = {
  title: string
  description: string
  deadline: Date
  departament: string
  skills: string[]
  type: string
  projectLength: string
  numberOfApplicants: string | null
  contributors: Contributor[] | null
  payments: Payment[]
  links: Link[] | null
  file: string | null
}

const NewTask = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [departament, setDepartament] = useState('')
  const [projectLength, setProjectLength] = useState('')
  const [numberOfApplicants, setNumberOfApplicants] = useState('')
  const [type, setType] = useState('Individual')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [links, setLinks] = useState<Link[]>([
    { title: 'githubLink', url: '' },
    { title: 'calendarLink', url: '' },
    { title: 'reachOutLink', url: '' },
  ])
  const departamentOptions = ['Data', 'Frontend', 'Blockchain', 'Cloud']
  const projectLengthOptions = [
    'Less than 1 week',
    '1 to 2 weeks',
    '2 to 4 weeks',
    'More than 4 weeks',
  ]
  const numberOfApplicantsOptions = ['1', '2', '3', '4', '5']
  const typeOptions = ['Individual', 'Group']
  const { push } = useRouter()

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  const [erc20AddressReadAllowance, setErc20AddressReadAllowance] =
    useState<String>('')

  const { address, isConnecting, isDisconnected } = useAccount()
  const { chain, chains } = useNetwork()

  const [ipfsHashTaskData, setIpfsHashTaskData] = useState<String>('')

  const skillOptions = [
    'Backend',
    'Frontend',
    'Web development',
    'Solidity',
    'UI',
    'UX',
    'HR',
  ]

  const validSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Desc is required'),
    deadline: Yup.date()
      .transform((value, originalValue) => {
        return originalValue ? new Date(originalValue) : null
      })
      .typeError('Deadline is required')
      .required('Deadline is required'),
    departament: Yup.string().required('Department is required'),
    skills: Yup.array()
      .of(Yup.string())
      .min(2, 'At least two tags are required')
      .max(3, 'You can select up to 3 skills'),
    projectLength: Yup.string().required('Project length is required'),
    numberOfApplicants: Yup.string().required(
      'Number of applicants is required',
    ),
    githubLink: Yup.string().notRequired(),
    calendarLink: Yup.string().notRequired(),
    reachOutLink: Yup.string().notRequired(),
    type: Yup.string().notRequired(),
  })
  const {
    register,
    handleSubmit,
    setValue,
    control, // Adicione esta linha
    // eslint-disable-next-line no-unused-vars
    reset,
    formState: { errors },
  } = useForm<TaskSubmitForm>({
    resolver: yupResolver(validSchema),
  })

  const addLinks = () => {
    if (links.length > 4) {
      toast.error('Only 5 links per task', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
    setLinks([
      ...links,
      {
        title: '',
        url: '',
      },
    ])
  }

  const handleDeleteLinks = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleLink = (
    index: number,
    field: keyof Link,
    valueReceived: string,
  ) => {
    const newLink = [...links]

    if (newLink[index][field].length >= 200) {
      return
    }

    const value = valueReceived

    newLink[index][field] = value
    setLinks(newLink)
  }

  const addPayments = () => {
    if (payments.length > 4) {
      toast.error('Only 5 payments per task', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
    setPayments([
      ...payments,
      {
        tokenContract: '',
        amount: '',
      },
    ])
  }

  const addContributors = () => {
    if (contributors.length > 15) {
      toast.error('Maximum of 15', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
    setContributors([
      ...contributors,
      {
        walletAddress: '',
        budgetPercentage: 0,
      },
    ])
  }

  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index))
  }

  const handleDeleteContributors = (index: number) => {
    setContributors(contributors.filter((_, i) => i !== index))
  }

  const handleAmountPayment = (
    index: number,
    field: keyof Payment,
    valueReceived: string,
  ) => {
    const newPayment = [...payments]

    if (
      newPayment[index][field].length > 10000000000000000000000000000000000000
    ) {
      return
    }

    const value = valueReceived.replace(/[^0-9]/g, '')

    newPayment[index][field] = value
    setPayments(newPayment)
  }

  const handleERC20AddressPayment = (
    index: number,
    field: keyof Payment,
    valueReceived: string,
  ) => {
    const newPagamentos = [...payments]

    if (newPagamentos[index][field].length > 100) {
      return
    }

    const value = valueReceived

    newPagamentos[index][field] = value
    setPayments(newPagamentos)
  }

  const handleWalletAddressContributor = (
    index: number,
    field: keyof Contributor,
    valueReceived: string,
  ) => {
    const newContributors = [...contributors]

    if (newContributors[index]['walletAddress'].length > 100) {
      return
    }

    const value = valueReceived

    newContributors[index]['walletAddress'] = value
    setContributors(newContributors)
  }

  const handleBudgetPercentage = (
    index: number,
    field: keyof Contributor,
    valueReceived: string,
  ) => {
    const newContributors = [...contributors]

    if (
      Number(newContributors[index][field]) &&
      Number(newContributors[index][field]) >= 100
    ) {
      return
    }

    const value = valueReceived.replace(/[^0-9]/g, '')

    newContributors[index]['budgetPercentage'] = Number(value)
    setContributors(newContributors)
  }

  const FileList: FC<FileListProps> = ({ files, onRemove }) => {
    return (
      <ul className="mt-4 max-h-[190px] max-w-[300px] overflow-y-auto text-[#000000]">
        {files.map((file, index) => (
          <li
            key={`selected-${index}`}
            className="mb-2 mr-2 ml-4 flex items-center"
          >
            <span title={file.name} className="ml-auto block w-full truncate">
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={isLoading}
              className="ml-2 rounded px-1 py-0.5 text-sm  text-[#ff0000]"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    )
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log('fazendo a chamada do file')
      const newFiles = Array.from(event.target.files)
      let validFiles = true
      const allowedMimeTypes = ['image/jpeg', 'image/png']
      const maxFileSize = 10 * 1024 * 1024 // 10 MB

      if (newFiles.length > 1) {
        toast.error(`Only 1 file per task for the MVP.`)
        return
      }

      newFiles.forEach((file) => {
        if (!allowedMimeTypes.includes(file.type)) {
          validFiles = false
          toast.error(`Only JPG, JPEG, PNG allowed for the MVP.`)
          return
        }
        if (file.size > maxFileSize) {
          validFiles = false
          toast.error(`The file ${file.name} is too heavy. Max of 10 MB.`)
          return
        }
        const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 15)
        setSelectedFiles(combinedFiles)
      })
    }
  }
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  async function handleFileUploadIPFS() {
    const file = selectedFiles[0]
    const formData = new FormData()
    formData.append('file', file)

    // Configurações do axios para a API Pinata
    const pinataAxios = axios.create({
      baseURL: 'https://api.pinata.cloud/pinning/',
      headers: {
        pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    const response = await pinataAxios.post('pinFileToIPFS', formData)

    // O hash é o identificador exclusivo do arquivo no IPFS
    const ipfsHash = response.data.IpfsHash

    console.log('File uploaded to IPFS with hash', ipfsHash)

    return ipfsHash
  }

  async function formsUploadIPFS(data: IPFSSubmition) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/functions/uploadIPFSMetadataTaskCreation`,
      headers: {
        'x-parse-application-id':
          'as90qw90uj3j9201fj90fj90dwinmfwei98f98ew0-o0c1m221dds222143',
      },
      data,
    }

    let dado

    await axios(config).then(function (response) {
      if (response.data) {
        dado = response.data
        console.log(dado)
      }
    })

    return dado
  }

  async function handleAllowanceFromTokens() {
    for (let i = 0; i < payments.length; i++) {
      const data = await readContract({
        address: `0x${payments[i].tokenContract.substring(2)}`,
        abi: erc20ContractABI,
        args: [address, `0x${taskAddress.substring(2)}`],
        functionName: 'allowance',
      })
      console.log('o valor q recebi')
      console.log(data)
      if (Number(data) < Number(payments[i].amount)) {
        console.log('required to increase allowance')
        const { request } = await prepareWriteContract({
          address: `0x${payments[i].tokenContract.substring(2)}`,
          abi: erc20ContractABI,
          args: [
            `0x${taskAddress.substring(2)}`,
            Number(payments[i].amount) * 100,
          ],
          functionName: 'approve',
        })
        const { hash } = await writeContract(request)
        const data = await waitForTransaction({
          hash,
        })
        console.log('the data')
        console.log(data)
        await new Promise((resolve) => setTimeout(resolve, 4500))
        if (data.status !== 'success') {
          throw data
        }
      }
    }
  }

  async function handleCreateTask(
    metadata: string,
    deadline: number,
    budget: Payment[],
  ) {
    const { request } = await prepareWriteContract({
      address: `0x${taskAddress.substring(2)}`,
      abi: taskContractABI,
      args: [metadata, deadline, budget, address, []],
      functionName: 'createTask',
    })
    const { hash } = await writeContract(request)
    const unwatch = watchContractEvent(
      {
        address: `0x${taskAddress.substring(2)}`,
        abi: taskContractABI,
        eventName: 'TaskCreated',
      },
      (log) => {
        console.log('event')
        console.log(log)
        if (log[0].transactionHash === hash) {
          push(`/task/${Number(log[0]['args']['taskId'])}`)
          console.log(log)
        }
      },
    )
    const data = await waitForTransaction({
      hash,
    })
    console.log('the data')
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 8500))
    if (data.status !== 'success') {
      throw data
    }
  }

  function handleIsPaymentsTokensValid() {
    for (const payment of payments) {
      if (!ethers.isAddress(payment.tokenContract)) {
        // this is not a valid address
        console.log('invalid address here')
        return false
      }
    }
    // all addresses are valid
    return true
  }

  async function onSubmit(data: TaskSubmitForm) {
    if (chain && chain.name !== 'Polygon Mumbai') {
      toast.error('Please switch chain before interacting with the protocol.')
      return
    }
    if (payments.length === 0) {
      toast.error('Please set a payment.')
      const element = document.getElementById('budgetId')
      element.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (contributors.length > 0) {
      let totalSumBudgetPercentage = 0
      for (let i = 0; i < contributors.length; i++) {
        totalSumBudgetPercentage += contributors[i].budgetPercentage
      }
      if (totalSumBudgetPercentage !== 100) {
        toast.error('Total sum of budget percentage needs to be 100.')
        const element = document.getElementById('contributorsId')
        element.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    setIsLoading(true)

    // verifying if all the ERC20 tokens are valid:

    const addressesValidPayment = await handleIsPaymentsTokensValid()
    if (!addressesValidPayment) {
      toast.error('All the ERC20 tokens need to have valid addresses!')
      const element = document.getElementById('budgetId')
      element.scrollIntoView({ behavior: 'smooth' })
      setIsLoading(false)
      return
    }

    let fileIPFSHash = ''
    if (selectedFiles.length > 0) {
      try {
        fileIPFSHash = await handleFileUploadIPFS()
      } catch (err) {
        toast.error('Something ocurred')
        console.log(err)
        setIsLoading(false)
        return
      }
    }

    const finalData = {
      ...data,
      projectLength,
      numberOfApplicants,
      contributors,
      payments,
      links,
      file: fileIPFSHash,
    }

    let ipfsHashData
    try {
      const res = await formsUploadIPFS(finalData)
      console.log('a resposta:')
      console.log(res)
      ipfsHashData = res
      setIpfsHashTaskData(res)
    } catch (err) {
      toast.error('something ocurred')
      console.log(err)
      setIsLoading(false)
      return
    }

    try {
      await handleAllowanceFromTokens()
    } catch (err) {
      toast.error('Something happened, please try again')
      setIsLoading(false)
      return
    }
    try {
      await handleCreateTask(
        ipfsHashData,
        Math.floor(data.deadline.getTime() / 1000),
        payments,
      )
      await new Promise((resolve) => setTimeout(resolve, 2500))
      toast.success('Task created succesfully!')
    } catch (err) {
      toast.error(
        'Error! Please ensure you have enough tokens in your wallet to pay for the budget',
      )
      console.log(err)
      setIsLoading(false)
    }
  }

  if (!address) {
    return (
      <div className="pb-[500px]">
        <HeroNewTasks />
      </div>
    )
  }

  return (
    <>
      <HeroNewTasks />
      <section className="mt-12 mb-24  px-32 text-[14px] font-medium !leading-[17px]  text-[#000000]">
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="">
              <div>
                <div className="">
                  <div className="">
                    <span className="flex flex-row">
                      Project Title
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                        {errors.title?.message}
                      </p>
                    </span>
                    <input
                      disabled={isLoading}
                      className="mt-[10px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                      type="text"
                      maxLength={100}
                      placeholder=""
                      {...register('title')}
                    />
                  </div>
                  <div className="mt-[30px]">
                    <span className="flex flex-row">
                      Tag the project for easier discovery
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                        {errors.skills?.message}
                      </p>
                    </span>
                    <Controller
                      name="skills"
                      control={control}
                      defaultValue={[]}
                      rules={{
                        required: 'At least two tags are required',
                        validate: (value) =>
                          value.length >= 2 || 'At least two tags are required',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          popupIcon={
                            <svg
                              width="16"
                              height="10"
                              viewBox="0 0 16 10"
                              className="mr-[15px] mt-[13px]"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.15474 9.65876L0.35261 3.07599C-0.117537 2.62101 -0.117537 1.88529 0.35261 1.43514L1.48296 0.341239C1.95311 -0.113746 2.71335 -0.113746 3.17849 0.341239L8 5.00726L12.8215 0.341239C13.2917 -0.113746 14.0519 -0.113746 14.517 0.341239L15.6474 1.43514C16.1175 1.89013 16.1175 2.62585 15.6474 3.07599L8.84527 9.65876C8.38512 10.1137 7.62488 10.1137 7.15474 9.65876Z"
                                fill="#959595"
                              />
                            </svg>
                          }
                          disabled={isLoading}
                          className="mt-[10px]"
                          options={skillOptions}
                          size="small"
                          getOptionLabel={(option) => `${option}`}
                          filterOptions={(options, state) =>
                            options.filter((option) =>
                              option
                                .toLowerCase()
                                .includes(state.inputValue.toLowerCase()),
                            )
                          }
                          onChange={(e, newValue) => {
                            if (newValue.length <= 8) {
                              field.onChange(newValue)
                            } else {
                              console.log('not aloweed')
                              toast.error('Only 8 tags per task', {
                                position: toast.POSITION.TOP_RIGHT,
                              })
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              id="margin-none"
                              sx={{
                                width: '500px',
                                fieldset: {
                                  height: '55px',
                                  borderColor: '#D4D4D4',
                                  borderRadius: '10px',
                                },
                                input: { color: 'black' },
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="mt-[30px]">
                    <span className="flex flex-row">
                      Project length
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                        {errors.projectLength?.message}
                      </p>
                    </span>
                    <Controller
                      name="projectLength"
                      control={control}
                      rules={{ required: 'Project length is required' }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          disabled={isLoading}
                          popupIcon={
                            <svg
                              width="16"
                              height="10"
                              viewBox="0 0 16 10"
                              className="mr-[15px] mt-[13px]"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.15474 9.65876L0.35261 3.07599C-0.117537 2.62101 -0.117537 1.88529 0.35261 1.43514L1.48296 0.341239C1.95311 -0.113746 2.71335 -0.113746 3.17849 0.341239L8 5.00726L12.8215 0.341239C13.2917 -0.113746 14.0519 -0.113746 14.517 0.341239L15.6474 1.43514C16.1175 1.89013 16.1175 2.62585 15.6474 3.07599L8.84527 9.65876C8.38512 10.1137 7.62488 10.1137 7.15474 9.65876Z"
                                fill="#959595"
                              />
                            </svg>
                          }
                          value={projectLength}
                          onChange={(e, newValue) => {
                            field.onChange(newValue)
                            setProjectLength(newValue)
                          }}
                          className="mt-[10px]"
                          options={projectLengthOptions}
                          getOptionLabel={(option) => `${option}`}
                          sx={{
                            width: '500px',
                            fieldset: {
                              height: '55px',
                              borderColor: '#D4D4D4',
                              borderRadius: '10px',
                            },
                            input: { color: 'black' },
                          }}
                          size="small"
                          filterOptions={(options, state) =>
                            options.filter((option) =>
                              option
                                .toLowerCase()
                                .includes(state.inputValue.toLowerCase()),
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label=""
                              variant="outlined"
                              id="margin-none"
                              sx={{
                                width: '500px',
                                fieldset: {
                                  height: '55px',
                                  borderColor: '#D4D4D4',
                                  borderRadius: '10px',
                                },
                                input: { color: 'black' },
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="mt-[30px]" id="budgetId">
                    <span className="flex flex-row">
                      Deadline
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                        {errors.deadline?.message}
                      </p>
                    </span>
                    <Controller
                      control={control}
                      name="deadline"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                          onChange={onChange}
                          onBlur={onBlur}
                          selected={value}
                          dateFormat="yyyy-MM-dd"
                          disabled={isLoading}
                          className="mt-[10px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                        />
                      )}
                    />
                  </div>
                  <div className="mt-[30px] max-h-[500px] overflow-auto">
                    <span className="flex flex-row">Budget</span>
                    {payments.map((pagamento, index) => (
                      <div key={index} className="payment mb-2">
                        <div className="mb-1 mt-4 flex items-center text-sm font-medium">
                          <h3>Payment {index + 1}</h3>
                          {index === payments.length - 1 && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleDeletePayment(index)}
                              className="ml-2 font-extrabold text-[#707070]"
                            >
                              X
                            </button>
                          )}
                        </div>
                        <div className="flex justify-start">
                          <div className="">
                            <label
                              htmlFor={`payment-${index}-erc20Address`}
                              className="mb-1 block text-xs"
                            >
                              ERC20 Token
                            </label>
                            <input
                              type="text"
                              disabled={isLoading}
                              id={`payment-${index}-erc20Address`}
                              value={pagamento.tokenContract}
                              onChange={(e) =>
                                handleERC20AddressPayment(
                                  index,
                                  'tokenContract',
                                  e.target.value,
                                )
                              }
                              className="mt-[8px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                            />
                          </div>
                          <div className="ml-2">
                            <label
                              htmlFor={`payment-${index}-amount`}
                              className="mb-1 block text-xs"
                            >
                              Amount (with decimal places)
                            </label>
                            <input
                              type="text"
                              disabled={isLoading}
                              id={`payment-${index}-amount`}
                              value={pagamento.amount}
                              onChange={(e) =>
                                handleAmountPayment(
                                  index,
                                  'amount',
                                  e.target.value,
                                )
                              }
                              className="mt-[8px] mr-[15px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                            />
                          </div>
                          {index === payments.length - 1 && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={addPayments}
                              className="mt-[28px] h-[50px] w-[129px] rounded-[10px] border border-[#D4D4D4] bg-white px-2 text-[14px]  font-normal text-[#D4D4D4] hover:text-[#b6b5b5]"
                            >
                              + Add more
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!payments || payments.length === 0) && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={addPayments}
                        className="mt-[10px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-2 text-[14px]  font-normal text-[#D4D4D4] hover:text-[#b6b5b5]"
                      >
                        + Add payment
                      </button>
                    )}
                  </div>
                  <div className="mt-[30px]" id="contributorsId">
                    <span className="flex flex-row">
                      Number of applicants/contributors needed
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                        {errors.numberOfApplicants?.message}
                      </p>
                    </span>
                    <Controller
                      name="numberOfApplicants"
                      control={control}
                      rules={{ required: 'Number of applicants is required' }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          disabled={isLoading}
                          value={numberOfApplicants}
                          popupIcon={
                            <svg
                              width="16"
                              height="10"
                              viewBox="0 0 16 10"
                              className="mr-[15px] mt-[13px]"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.15474 9.65876L0.35261 3.07599C-0.117537 2.62101 -0.117537 1.88529 0.35261 1.43514L1.48296 0.341239C1.95311 -0.113746 2.71335 -0.113746 3.17849 0.341239L8 5.00726L12.8215 0.341239C13.2917 -0.113746 14.0519 -0.113746 14.517 0.341239L15.6474 1.43514C16.1175 1.89013 16.1175 2.62585 15.6474 3.07599L8.84527 9.65876C8.38512 10.1137 7.62488 10.1137 7.15474 9.65876Z"
                                fill="#959595"
                              />
                            </svg>
                          }
                          onChange={(e, newValue) => {
                            field.onChange(newValue)
                            setNumberOfApplicants(newValue)
                          }}
                          className="mt-[10px]"
                          options={numberOfApplicantsOptions}
                          getOptionLabel={(option) => `${option}`}
                          sx={{
                            width: '500px',
                            fieldset: {
                              height: '55px',
                              borderColor: '#D4D4D4',
                              borderRadius: '10px',
                            },
                            input: { color: 'black' },
                          }}
                          size="small"
                          filterOptions={(options, state) =>
                            options.filter((option) =>
                              option
                                .toLowerCase()
                                .includes(state.inputValue.toLowerCase()),
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label=""
                              variant="outlined"
                              id="margin-none"
                              sx={{
                                width: '500px',
                                fieldset: {
                                  height: '55px',
                                  borderColor: '#D4D4D4',
                                  borderRadius: '10px',
                                },
                                input: { color: 'black' },
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="mt-[30px] max-h-[500px]  overflow-auto">
                    <span className="flex flex-row">
                      Add contributors (optional)
                    </span>
                    {contributors.map((contributor, index) => (
                      <div key={index} className="payment mb-2">
                        <div className="mb-1 mt-4 flex items-center text-sm font-medium">
                          <h3>Contributor {index + 1}</h3>
                          {index === contributors.length - 1 && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleDeleteContributors(index)}
                              className="ml-2 font-extrabold text-[#707070]"
                            >
                              X
                            </button>
                          )}
                        </div>
                        <div className="flex justify-start">
                          <div className="">
                            <label
                              htmlFor={`contributor-${index}-walletAddress`}
                              className="mb-1 block text-xs"
                            >
                              Wallet address
                            </label>
                            <input
                              type="text"
                              disabled={isLoading}
                              id={`contributor-${index}-walletAddress`}
                              value={contributor.walletAddress}
                              onChange={(e) =>
                                handleWalletAddressContributor(
                                  index,
                                  'walletAddress',
                                  e.target.value,
                                )
                              }
                              className="mt-[8px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                            />
                          </div>
                          <div className="ml-2">
                            <label
                              htmlFor={`payment-${index}-amount`}
                              className="mb-1 block text-xs"
                            >
                              Budget %
                            </label>
                            <input
                              type="text"
                              disabled={isLoading}
                              id={`payment-${index}-amount`}
                              value={contributor.budgetPercentage}
                              onChange={(e) =>
                                handleBudgetPercentage(
                                  index,
                                  'budgetPercentage',
                                  e.target.value,
                                )
                              }
                              className="mt-[8px] mr-[15px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                            />
                          </div>
                          {index === contributors.length - 1 && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={addContributors}
                              className="mt-[28px] h-[50px] w-[129px] rounded-[10px] border border-[#D4D4D4] bg-white px-2 text-[14px]  font-normal text-[#D4D4D4] hover:text-[#b6b5b5]"
                            >
                              + Add more
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!contributors || contributors.length === 0) && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={addContributors}
                        className="mt-[10px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-2 text-[14px]  font-normal text-[#D4D4D4] hover:text-[#b6b5b5]"
                      >
                        + Add contributor
                      </button>
                    )}
                  </div>
                  <div className="mt-[30px]">
                    <span className="flex flex-row">
                      Project Description (full)
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                        {errors.description?.message}
                      </p>
                    </span>
                    <textarea
                      disabled={isLoading}
                      style={{ resize: 'none' }}
                      className="mt-[10px] h-[574px] w-[800px] rounded-[10px] border border-[#D4D4D4] bg-white px-[25px] py-[25px] text-[17px] font-normal outline-0"
                      maxLength={5000}
                      placeholder="Type here"
                      {...register('description')}
                    />
                  </div>
                </div>
                <div className="mt-[30px]">
                  <span className="flex flex-row">
                    Departament
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.departament?.message}
                    </p>
                  </span>
                  <Controller
                    name="departament"
                    control={control}
                    rules={{ required: 'Department is required' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        disabled={isLoading}
                        popupIcon={
                          <svg
                            width="16"
                            height="10"
                            viewBox="0 0 16 10"
                            className="mr-[15px] mt-[13px]"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.15474 9.65876L0.35261 3.07599C-0.117537 2.62101 -0.117537 1.88529 0.35261 1.43514L1.48296 0.341239C1.95311 -0.113746 2.71335 -0.113746 3.17849 0.341239L8 5.00726L12.8215 0.341239C13.2917 -0.113746 14.0519 -0.113746 14.517 0.341239L15.6474 1.43514C16.1175 1.89013 16.1175 2.62585 15.6474 3.07599L8.84527 9.65876C8.38512 10.1137 7.62488 10.1137 7.15474 9.65876Z"
                              fill="#959595"
                            />
                          </svg>
                        }
                        value={departament}
                        onChange={(e, newValue) => {
                          field.onChange(newValue)
                          setDepartament(newValue)
                        }}
                        className="mt-[10px]"
                        options={departamentOptions}
                        getOptionLabel={(option) => `${option}`}
                        sx={{
                          width: '500px',
                          fieldset: {
                            height: '55px',
                            borderColor: '#D4D4D4',
                            borderRadius: '10px',
                          },
                          input: { color: 'black' },
                        }}
                        size="small"
                        filterOptions={(options, state) =>
                          options.filter((option) =>
                            option
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase()),
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label=""
                            variant="outlined"
                            id="margin-none"
                            sx={{
                              width: '500px',
                              fieldset: {
                                height: '55px',
                                borderColor: '#D4D4D4',
                                borderRadius: '10px',
                              },
                              input: { color: 'black' },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>
                <div className="mt-[30px]">
                  <span className="flex flex-row">
                    Github Repository Link
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.githubLink?.message}
                    </p>
                  </span>
                  <input
                    type="text"
                    disabled={isLoading}
                    maxLength={200}
                    {...register('githubLink')}
                    onChange={(e) => handleLink(0, 'url', e.target.value)}
                    className="mt-[10px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                  />
                </div>
                <div className="mt-[30px]">
                  <span className="flex flex-row">
                    Calendar Link
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.calendarLink?.message}
                    </p>
                  </span>
                  <input
                    type="text"
                    disabled={isLoading}
                    maxLength={200}
                    {...register('calendarLink')}
                    onChange={(e) => handleLink(1, 'url', e.target.value)}
                    className="mt-[10px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                  />
                </div>
                <div className="mt-[30px]">
                  <span className="flex flex-row">
                    Reach out Link
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.reachOutLink?.message}
                    </p>
                  </span>
                  <input
                    type="text"
                    disabled={isLoading}
                    maxLength={200}
                    {...register('reachOutLink')}
                    onChange={(e) => handleLink(2, 'url', e.target.value)}
                    className="mt-[10px] h-[50px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                  />
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="mt-[30px] flex pb-60">
                <button
                  disabled={true}
                  className=" mr-[15px] h-[50px] w-[250px] rounded-[10px] bg-[#53c781] py-[12px] px-[25px] text-[16px] font-bold  text-white hover:bg-[#53c781]"
                  onClick={handleSubmit(onSubmit)}
                >
                  <span className="">Submit for Review</span>
                </button>
                <svg
                  className="mt-1 animate-spin"
                  height="40px"
                  id="Icons"
                  version="1.1"
                  viewBox="0 0 80 80"
                  width="40px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M58.385,34.343V21.615L53.77,26.23C50.244,22.694,45.377,20.5,40,20.5c-10.752,0-19.5,8.748-19.5,19.5S29.248,59.5,40,59.5  c7.205,0,13.496-3.939,16.871-9.767l-4.326-2.496C50.035,51.571,45.358,54.5,40,54.5c-7.995,0-14.5-6.505-14.5-14.5  S32.005,25.5,40,25.5c3.998,0,7.617,1.632,10.239,4.261l-4.583,4.583H58.385z" />
                </svg>
              </div>
            ) : (
              <div className="mt-[30px] pb-60">
                <button
                  type="submit"
                  className=" h-[50px] w-[250px] rounded-[10px] bg-[#12AD50] py-[12px] px-[25px] text-[16px] font-bold  text-white hover:bg-[#0e7a39]"
                  onClick={handleSubmit(onSubmit)}
                >
                  <span className="">Submit for Review</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

export default NewTask
