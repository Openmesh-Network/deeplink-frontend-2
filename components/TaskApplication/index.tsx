/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { ethers } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import { Range } from 'react-range'
import { TextField, Autocomplete } from '@mui/material'
import { Slider } from 'rsuite'
import Decimal from 'decimal.js'
import {
  readContract,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
  watchContractEvent,
} from '@wagmi/core'
import taskContractABI from '@/utils/abi/taskContractABI.json'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import axios from 'axios'
import { Link } from '@/types/task'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HeroTaskApplication from './HeroTaskApplication'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

type TaskApplicationForm = {
  displayName: string
  description: string
  githubLink: string
  additionalLink: string
  howLikelyToMeetTheDeadline: string
}

type Payment = {
  tokenContract: string
  amount: string
}

type IPFSSubmition = {
  displayName: string
  description: string
  howLikelyToMeetTheDeadline: string
  links: Link[] | null
}

const TaskApplication = (id: any) => {
  Decimal.set({ precision: 60 })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [viewOption, setViewOption] = useState('projectDescription')
  const [taskChainData, setTaskChainData] = useState<any>()
  const [budgetValue, setBudgetValue] = useState([100])
  const [budgetValueInputColor, setBudgetValueInputColor] =
    useState<String>('#009A50')
  const [estimatedBudgetRequested, setEstimatedBudgetRequested] =
    useState<String>('')
  const [budgetPercentage, setBudgetPercentage] = useState(100)
  const [howLikelyToMeetTheDeadlineValue, setHowLikelyToMeetTheDeadlineValue] =
    useState('')
  const colorsBudget = [
    '#39D303',
    '#31ce19',
    '#2aca24',
    '#22c52d',
    '#1ac033',
    '#12bc39',
    '#09b73e',
    '#01b242',
    '#00ad46',
    '#009A50',
    '#00a44c',
    '#009f4e',
    '#009a50',
    '#32973e',
    '#4a942b',
    '#5d9015',
    '#6e8c00',
    '#7e8700',
    '#8d8100',
    '#9c7a00',
    '#ab7200',
    '#b86900',
    '#c55e00',
    '#d15101',
    '#db421c',
  ]

  const rangePerColor = 250 / colorsBudget.length

  const [payments, setPayments] = useState<Payment[]>([])

  const [links, setLinks] = useState<Link[]>([
    { title: 'githubLink', url: '' },
    { title: 'additionalLink', url: '' },
  ])

  const getColor = (value) => {
    if (value < 50) {
      return 'bg-yellow-500'
    } else if (value > 150) {
      return 'bg-orange-500'
    } else {
      return 'bg-green-500'
    }
  }

  const { address } = useAccount()
  const { chain, chains } = useNetwork()

  const { push } = useRouter()

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  const howLikelyToMeetTheDeadlineOptions = [
    'Very unlikely',
    'Unlikely',
    'Likely',
    'Very likely',
  ]

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

  const validSchema = Yup.object().shape({
    displayName: Yup.string().required('Display name is required'),
    description: Yup.string().required('Desc is required'),
    githubLink: Yup.string().required('Github repo is required'),
    howLikelyToMeetTheDeadline: Yup.string().required('Required'),
    additionalLink: Yup.string().notRequired(),
  })
  const {
    register,
    handleSubmit,
    setValue,
    control, // Adicione esta linha
    // eslint-disable-next-line no-unused-vars
    reset,
    formState: { errors },
  } = useForm<TaskApplicationForm>({
    resolver: yupResolver(validSchema),
  })

  async function formsUploadIPFS(data: IPFSSubmition) {
    const config = {
      method: 'post' as 'post',
      url: `https://dpl-backend-homolog.up.railway.app/functions/uploadIPFSMetadataTaskCreation`,
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

  async function getTaskFromChain(id: any) {
    setIsLoading(true)
    console.log('getting data from task')
    let data
    try {
      data = await readContract({
        address: `0x${taskAddress.substring(2)}`,
        abi: taskContractABI,
        args: [Number(id)],
        functionName: 'getTask',
      })
      setTaskChainData(data)
      setIsLoading(false)
    } catch (err) {
      toast.error('Task not found!')
      setIsLoading(false)
    }

    console.log('the data:')
    console.log(data)
  }

  async function getTask(taskId: string) {
    const data = {
      id: taskId,
    }
    setIsLoading(true)
    const config = {
      method: 'post' as 'post',
      url: `https://dpl-backend-homolog.up.railway.app/functions/getTask`,
      headers: {
        'x-parse-application-id':
          'as90qw90uj3j9201fj90fj90dwinmfwei98f98ew0-o0c1m221dds222143',
      },
      data,
    }
    try {
      await axios(config).then(function (response) {
        if (response.data) {
          console.log('here is the task')
          console.log(response.data)
          setTaskChainData(response.data)
          setEstimatedBudgetRequested(
            Number(response.data.estimatedBudget).toLocaleString('en-US') ||
              '0',
          )
          setIsLoading(false)
        }
      })
    } catch (err) {
      toast.error('Task not found!')
      setIsLoading(false)
    }
  }

  async function handleCreateApplication(
    taskId: number,
    metadata: string,
    budget: Payment[],
  ) {
    const { request } = await prepareWriteContract({
      address: `0x${taskAddress.substring(2)}`,
      abi: taskContractABI,
      args: [taskId, metadata, budget],
      functionName: 'applyForTask',
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
    } else {
      toast.success('Applied succesfully!')
    }
  }

  async function onSubmit(data: TaskApplicationForm) {
    if (chain && chain.name !== 'Polygon Mumbai') {
      toast.error('Please switch chain before interacting with the protocol.')
      return
    }

    setIsLoading(true)

    const finalData = {
      ...data,
      links,
    }

    // eslint-disable-next-line no-unreachable
    let ipfsHashData
    try {
      const res = await formsUploadIPFS(finalData)
      console.log('a resposta:')
      console.log(res)
      ipfsHashData = res
    } catch (err) {
      toast.error('something ocurred')
      console.log(err)
      setIsLoading(false)
    }

    try {
      await handleCreateApplication(id, ipfsHashData, payments)
      toast.success('Application done succesfully!')
    } catch (err) {
      toast.error('Error during the task application')
      console.log(err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      console.log('search for the task info on blockchain')
      console.log(id.id)
      getTask(id.id)
    }
  }, [id])

  if (!address) {
    return (
      <div className="pb-[500px]">
        <HeroTaskApplication />
      </div>
    )
  }

  if (isLoading) {
    return (
      <section className="py-16 px-32 text-black md:py-20 lg:pt-40">
        <div className="container flex h-60 animate-pulse px-0 pb-12">
          <div className="mr-10 w-3/4 animate-pulse bg-[#dfdfdf]"></div>
          <div className="w-1/4 animate-pulse bg-[#dfdfdf]"></div>
        </div>
        <div className="container h-96 animate-pulse bg-[#dfdfdf] pb-12"></div>
      </section>
    )
  }

  if (!isLoading && !taskChainData) {
    return (
      <section className="py-16 px-32 text-black md:py-20 lg:pt-40">
        <div className="container flex h-60 px-0 pb-[700px]">
          Task not found
        </div>
      </section>
    )
  }

  return (
    <>
      <HeroTaskApplication />
      <section className="mt-12 mb-24  px-32 text-[18px] font-medium text-[#000000]">
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="">
              <div>
                <div className="">
                  <div className="">
                    <span className="flex flex-row">
                      Display Name
                      <p className="ml-[8px] text-[12px] font-normal text-[#ff0000] ">
                        {errors.displayName?.message}
                      </p>
                    </span>
                    <input
                      disabled={isLoading}
                      className="mt-[8px] h-[42px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                      type="text"
                      maxLength={100}
                      placeholder=""
                      {...register('displayName')}
                    />
                  </div>
                  <div className="mt-[30px]">
                    <span className="flex flex-row">
                      Link to your Github, blog, profile
                      <p className="ml-[8px] text-[12px] font-normal text-[#ff0000] ">
                        {errors.githubLink?.message}
                      </p>
                    </span>
                    <input
                      type="text"
                      disabled={isLoading}
                      maxLength={200}
                      {...register('githubLink')}
                      onChange={(e) => handleLink(0, 'url', e.target.value)}
                      className="mt-[8px] h-[42px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                    />
                  </div>
                  <div className="mt-[30px]">
                    <span className="flex flex-row">
                      How likely to meet the deadline
                      <p className="ml-[8px] text-[12px] font-normal text-[#ff0000] ">
                        {errors.howLikelyToMeetTheDeadline?.message}
                      </p>
                    </span>
                    <Controller
                      name="howLikelyToMeetTheDeadline"
                      control={control}
                      rules={{ required: 'Required' }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          disabled={isLoading}
                          value={howLikelyToMeetTheDeadlineValue}
                          onChange={(e, newValue) => {
                            field.onChange(newValue)
                            setHowLikelyToMeetTheDeadlineValue(newValue)
                          }}
                          className="mt-2 text-body-color"
                          options={howLikelyToMeetTheDeadlineOptions}
                          getOptionLabel={(option) => `${option}`}
                          sx={{
                            width: '500px',
                            fieldset: {
                              height: '46px',
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
                                  height: '46px',
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
                      Are you happy with the budget or readjust
                    </span>
                    <div className="mt-[31px]">
                      <div className="relative w-full">
                        <Range
                          step={1}
                          min={0}
                          max={250}
                          values={budgetValue}
                          onChange={(values) => {
                            setBudgetValue(values)
                            setBudgetValueInputColor(
                              colorsBudget[
                                Math.floor(values[0] / rangePerColor)
                              ],
                            )
                            setEstimatedBudgetRequested(
                              Number(
                                new Decimal(
                                  taskChainData['estimatedBudget'],
                                ).mul(new Decimal(values[0] / 100)),
                              ).toLocaleString('en-US'),
                            )
                          }}
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: '9px',
                                width: '500px',
                                backgroundColor: '#ffffff',
                                borderRadius: '4px',
                                border: '1.5px solid #D4D4D4',
                              }}
                            >
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: '31px',
                                width: '53px',
                                backgroundColor: `${budgetValueInputColor}`,
                                borderRadius: '0px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <div className="text-xs font-semibold">
                                {budgetValue}%
                              </div>
                            </div>
                          )}
                        />
                        <Range
                          step={1}
                          min={0}
                          max={250}
                          values={budgetValue}
                          onChange={() => {}} // Não faz nada ao alterar
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: '0',
                                width: '500px',
                                backgroundColor: 'transparent',
                              }}
                            >
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: '0',
                                width: '250px', // Aumente a largura conforme necessário
                                backgroundColor: 'transparent',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                top: '40px', // Ajuste conforme necessário
                              }}
                            >
                              <div
                                className={`font-regular text-[12px] ${
                                  estimatedBudgetRequested === '0'
                                    ? 'ml-14'
                                    : ''
                                }`}
                              >
                                {estimatedBudgetRequested === '0'
                                  ? '❤️ Good choice! We thank you for your generosity for supporting our open initiative ❤️'
                                  : `Est. $${estimatedBudgetRequested}`}
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[100px]">
                    <span className="flex flex-row">
                      Give some details why you think you are qualified
                      <p className="ml-[8px] text-[10px] font-normal text-[#ff0000] ">
                        {errors.description?.message}
                      </p>
                    </span>
                    <textarea
                      disabled={isLoading}
                      style={{ resize: 'none' }}
                      className="mt-[8px] h-[190px] w-[800px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] py-[12px] text-[17px] font-normal outline-0"
                      maxLength={2000}
                      placeholder="Type here"
                      {...register('description')}
                    />
                  </div>
                  <div className="mt-[30px]">
                    <span className="flex flex-row">
                      Additional links if needed
                      <p className="ml-[8px] text-[12px] font-normal text-[#ff0000] ">
                        {errors.additionalLink?.message}
                      </p>
                    </span>
                    <input
                      type="text"
                      disabled={isLoading}
                      maxLength={200}
                      {...register('additionalLink')}
                      onChange={(e) => handleLink(1, 'url', e.target.value)}
                      className="mt-[8px] h-[42px] w-[500px] rounded-[10px] border border-[#D4D4D4] bg-white px-[12px] text-[17px] font-normal outline-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            {isLoading ? (
              <button
                type="button"
                className="mt-[120px] pb-60 text-[18px] font-bold"
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
              <div className="mt-[120px] pb-60">
                <button
                  type="submit"
                  className=" w-[250px] rounded-[10px] bg-[#12AD50] py-[12px] px-[25px] text-[18px] font-bold  text-white hover:bg-[#0e7a39]"
                  onClick={handleSubmit(onSubmit)}
                >
                  <span className="">Submit your interest</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

export default TaskApplication
