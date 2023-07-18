/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, ChangeEvent, FC } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { UserOutlined } from '@ant-design/icons'
import TransactionList from '../TaskTransactionsList'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import taskContractABI from '@/utils/abi/taskContractABI.json'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
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

type TaskSubmitForm = {
  title: string
  description: string
  deadline: Date
  departament: string
  skills: string[]
  type: string
}

type Payment = {
  tokenContract: string
  amount: string
}

type Link = {
  title: string
  url: string
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
  payments: Payment[]
  links: Link[] | null
  file: string | null
}

const NewTask = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [departament, setDepartament] = useState('')
  const [type, setType] = useState('Individual')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const departamentOptions = ['Data', 'Frontend', 'Blockchain', 'Cloud']
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
      .min(1, 'At least one skill is required')
      .max(3, 'You can select up to 3 skills'),
    type: Yup.string().required('Type is required'),
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

    if (newLink[index][field].length > 200) {
      return
    }

    const value = valueReceived

    newLink[index][field] = value
    setLinks(newLink)
  }

  const addPayments = () => {
    if (links.length > 5) {
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

  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index))
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

    const value = valueReceived.replace(/[^0-9,]/g, '')

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
        pinata_api_key: '7b27a531082e163ee9ae',
        pinata_secret_api_key:
          '0397c0df5cc360ed98cf81f8435569775b0763aa004c00f470146911138475db',
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
    const pinataAxios = axios.create({
      baseURL: 'https://api.pinata.cloud/pinning/',
      headers: {
        pinata_api_key: '7b27a531082e163ee9ae',
        pinata_secret_api_key:
          '0397c0df5cc360ed98cf81f8435569775b0763aa004c00f470146911138475db',
        'Content-Type': 'application/json',
      },
    })

    const response = await pinataAxios.post('pinJSONToIPFS', data)

    const ipfsHash = response.data.IpfsHash

    console.log('JSON uploaded to IPFS with hash', ipfsHash)

    return ipfsHash
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
        await new Promise((resolve) => setTimeout(resolve, 2500))
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
      args: [metadata, deadline, budget],
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
    await new Promise((resolve) => setTimeout(resolve, 2500))
    if (data.status !== 'success') {
      throw data
    }
  }

  function handleIsPaymentsTokensValid() {
    for (const payment of payments) {
      if (!ethers.isAddress(payment.tokenContract)) {
        // this is not a valid address
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

    setIsLoading(true)

    // verifying if all the ERC20 tokens are valid:

    try {
      handleIsPaymentsTokensValid()
    } catch (err) {
      toast.error('All the ERC20 tokens need to have valid addresses!')
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
      await setIpfsHashTaskData(res)
    } catch (err) {
      toast.error('something ocurred')
      console.log(err)
      setIsLoading(false)
    }

    try {
      await handleAllowanceFromTokens()
    } catch (err) {
      toast.error('Something happened, please try again')
      setIsLoading(false)
    }
    try {
      await handleCreateTask(
        ipfsHashData,
        Math.floor(data.deadline.getTime() / 1000),
        payments,
      )
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
      <section className="py-16 px-32 text-[#000000] md:py-20 lg:pt-40">
        <div className="container  border-b-4 border-[#8d8d8d] pb-5">
          <div className="-mx-4 flex flex-wrap items-start">
            <div className="w-full px-4">
              <div className="wow fadeInUp" data-wow-delay=".2s">
                <div className="mb-1">
                  <h3 className="mb-4 text-xl font-normal  sm:text-3xl lg:text-4xl xl:text-5xl">
                    Create a task
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-8">Connect you wallet to continue</div>
      </section>
    )
  }

  return (
    <section className="py-16 px-32 text-[#000000] md:py-20 lg:pt-40">
      <div className="container  border-b-4 border-[#8d8d8d] pb-5">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-normal  sm:text-3xl lg:text-4xl xl:text-5xl">
                  Create a task
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="">
            <div>
              <div className="">
                <div className="">
                  <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                    Title
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.title?.message}
                    </p>
                  </span>
                  <input
                    disabled={isLoading}
                    className="mt-[8px] h-[30px] w-full rounded-md border border-[#bcbaba] bg-white pl-2 text-[17px] font-normal leading-[30px] text-[#000000] placeholder-[#818181] shadow-none outline-0 focus:ring-0"
                    type="text"
                    maxLength={100}
                    placeholder="Type here"
                    {...register('title')}
                  />
                </div>
                <div className="mt-7">
                  <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                    Description
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.description?.message}
                    </p>
                  </span>
                  <textarea
                    disabled={isLoading}
                    style={{ resize: 'none' }}
                    className="mt-[8px] h-[160px] w-full rounded-md   border border-[#bcbaba] bg-white pt-2 pl-2 text-[17px] font-normal leading-[30px] text-[#000000] placeholder-[#818181] shadow-none outline-0 focus:ring-0"
                    maxLength={2000}
                    placeholder="Type here"
                    {...register('description')}
                  />
                </div>
              </div>
              <div className="mt-7 flex">
                <div className="w-1/3">
                  <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                    Departament
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.departament?.message}
                    </p>
                  </span>
                  <Controller
                    name="departament"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Department is required' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        disabled={isLoading}
                        value={departament}
                        onChange={(e, newValue) => {
                          field.onChange(newValue)
                          setDepartament(newValue)
                        }}
                        className="mt-2 text-body-color"
                        options={departamentOptions}
                        getOptionLabel={(option) => `${option}`}
                        sx={{
                          color: 'white',
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
                            label="Departament"
                            variant="outlined"
                            id="margin-none"
                            sx={{
                              input: { color: 'black' },
                              color: 'black',
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>
                <div className="mx-8 w-1/3">
                  <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                    Tags
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.skills?.message}
                    </p>
                  </span>
                  <Controller
                    name="skills"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: 'At least one skill is required' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        disabled={isLoading}
                        className="mt-2"
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
                          if (newValue.length <= 3) {
                            field.onChange(newValue)
                          } else {
                            console.log('not aloweed')
                            toast.error('Only 3 tags per task', {
                              position: toast.POSITION.TOP_RIGHT,
                            })
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tags"
                            variant="outlined"
                            id="margin-none"
                            sx={{
                              input: { color: 'black' },
                              color: 'black',
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>
                <div className="w-1/3">
                  <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                    Type
                    <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                      {errors.type?.message}
                    </p>
                  </span>
                  <Controller
                    name="type"
                    control={control}
                    defaultValue="Individual"
                    rules={{ required: 'Type is required' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        value={type}
                        disabled={isLoading}
                        onChange={(e, newValue) => {
                          field.onChange(newValue)
                          setType(newValue)
                        }}
                        className="mt-2  text-body-color"
                        options={typeOptions}
                        getOptionLabel={(option) => `${option}`}
                        sx={{
                          color: 'white',
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
                            label="Type"
                            variant="outlined"
                            id="margin-none"
                            sx={{
                              input: { color: 'black' },
                              color: 'black',
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex">
                <div className="link-group mt-7 max-h-[300px] w-1/3  overflow-auto bg-white">
                  <span className="flex flex-row text-[16px] font-bold leading-[20px]">
                    Budget
                  </span>
                  {payments.map((pagamento, index) => (
                    <div key={index} className="payment mb-2">
                      <div className="mb-1 mt-4 flex items-center text-sm font-medium">
                        <h3>Payment {index + 1}</h3>
                        {index === payments.length - 1 && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleDeletePayment(index)}
                            className="ml-2 font-extrabold text-[#ff0000]"
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
                            className="mt-[1px] h-[30px] w-full rounded-md border border-[#bcbaba] bg-white pl-2 text-xs font-semibold leading-[30px] text-[#000000] placeholder-[#818181] shadow-none outline-0 focus:ring-0"
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
                            className="mt-[1px] h-[30px] w-full rounded-md border border-[#bcbaba] bg-white pl-2 text-xs font-semibold leading-[30px] text-[#000000] placeholder-[#818181] shadow-none outline-0 focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={addPayments}
                    className="mt-2 w-full rounded border border-[#707070] bg-white p-1 px-2 text-[#000000] hover:bg-[#707070] hover:text-white"
                  >
                    Add payment
                  </button>
                </div>
                <div className="link-group mx-8 mt-7 max-h-[300px]  w-1/3 overflow-auto bg-white">
                  <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                    Links
                  </span>
                  {links.map((link, index) => (
                    <div key={index} className="payment mb-2">
                      <div className="mb-1 mt-4 flex items-center text-sm font-medium">
                        <h3>Link {index + 1}</h3>
                        {index === links.length - 1 && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleDeleteLinks(index)}
                            className="ml-2 font-extrabold text-[#ff0000]"
                          >
                            X
                          </button>
                        )}
                      </div>
                      <div className="flex justify-start">
                        <div className="">
                          <label
                            htmlFor={`link-${index}-title`}
                            className="mb-1 block text-xs"
                          >
                            Title{' '}
                          </label>
                          <input
                            type="text"
                            disabled={isLoading}
                            id={`link-${index}-title`}
                            value={link.title}
                            onChange={(e) =>
                              handleLink(index, 'title', e.target.value)
                            }
                            className="mt-[1px] h-[30px] w-full rounded-md border border-[#bcbaba] bg-white pl-2 text-xs font-semibold leading-[30px] text-[#000000] placeholder-[#818181] shadow-none outline-0 focus:ring-0"
                          />
                        </div>
                        <div className="ml-2">
                          <label
                            htmlFor={`link-${index}-url`}
                            className="mb-1 block text-xs"
                          >
                            URL
                          </label>
                          <input
                            disabled={isLoading}
                            type="text"
                            id={`link-${index}-url`}
                            value={link.url}
                            onChange={(e) =>
                              handleLink(index, 'url', e.target.value)
                            }
                            className="mt-[1px] h-[30px] w-full rounded-md border border-[#bcbaba] bg-white pl-2 text-xs font-semibold leading-[30px] text-[#000000] placeholder-[#818181] shadow-none outline-0 focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={addLinks}
                    className="mt-2 w-full rounded border border-[#707070] bg-white p-1 px-2 text-[#000000] hover:bg-[#707070] hover:text-white"
                  >
                    Add link
                  </button>
                </div>
                <div className="mt-7 w-1/3">
                  <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                    File
                  </span>
                  {selectedFiles.length === 0 ? (
                    <label className="h-[50px] w-full cursor-pointer">
                      <div className="mt-2 rounded border border-[#707070] bg-white p-1 px-2 text-center text-[#000000] hover:bg-[#707070] hover:text-white">
                        <span className="font-normal">Select a file</span>
                        <input
                          type="file"
                          disabled={isLoading}
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  ) : (
                    <FileList files={selectedFiles} onRemove={removeFile} />
                  )}
                </div>
              </div>

              <div className="mt-7">
                <span className="text-gray900 flex flex-row text-[16px] font-bold leading-[20px]">
                  Deadline
                  <p className="text-red-500 ml-[8px] text-[13px] ">
                    {errors.deadline?.message}
                  </p>
                </span>
                <input
                  disabled={isLoading}
                  className="mt-[8px] h-[30px] w-[150px] rounded-md  border border-[#bcbaba] bg-[#d1caca] pl-2 text-[17px] font-semibold leading-[30px] text-[#000000] placeholder-[#818181] shadow-none outline-0 focus:ring-0"
                  type="date"
                  {...register('deadline')}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <button
              type="button"
              className="mt-20 flex w-[120px] rounded bg-[#8a8a8b] p-1 font-bold  text-white"
              onClick={handleSubmit(onSubmit)}
              disabled={true}
            >
              <svg
                className="animate-spin"
                height="40px"
                id="Icons"
                version="1.1"
                viewBox="0 0 80 80"
                width="40px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M58.385,34.343V21.615L53.77,26.23C50.244,22.694,45.377,20.5,40,20.5c-10.752,0-19.5,8.748-19.5,19.5S29.248,59.5,40,59.5  c7.205,0,13.496-3.939,16.871-9.767l-4.326-2.496C50.035,51.571,45.358,54.5,40,54.5c-7.995,0-14.5-6.505-14.5-14.5  S32.005,25.5,40,25.5c3.998,0,7.617,1.632,10.239,4.261l-4.583,4.583H58.385z" />
              </svg>
              <span className="pt-2 pr-4">Loading</span>
            </button>
          ) : (
            <button
              type="submit"
              className="mt-20  w-[120px] rounded bg-[#0c0ca3] p-1 font-bold text-white  hover:bg-[#2f2fd3]"
              onClick={handleSubmit(onSubmit)}
            >
              <span className="">Create task</span>
            </button>
          )}
        </form>
      </div>
    </section>
  )
}

export default NewTask
