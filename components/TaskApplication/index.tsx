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
import { TextField, Autocomplete } from '@mui/material'
import { readContract, writeContract } from '@wagmi/core'
import taskContractABI from '@/utils/abi/taskContractABI.json'
import erc20ContractABI from '@/utils/abi/erc20ContractABI.json'
import axios from 'axios'
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

type Link = {
  title: string
  url: string
}

const TaskApplication = (id: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [viewOption, setViewOption] = useState('projectDescription')
  const [taskChainData, setTaskChainData] = useState<any>()
  const [howLikelyToMeetTheDeadlineValue, setHowLikelyToMeetTheDeadlineValue] =
    useState('')

  const [links, setLinks] = useState<Link[]>([
    { title: 'githubLink', url: '' },
    { title: 'additionalLink', url: '' },
  ])

  const { address } = useAccount()
  const { chain, chains } = useNetwork()

  const { push } = useRouter()

  const taskAddress = process.env.NEXT_PUBLIC_TASK_ADDRESS

  const howLikelyToMeetTheDeadlineOptions = [
    'Very unlikely',
    'A little unlikely',
    'A little likely',
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
    } catch (err) {
      toast.error('Task not found!')
      setIsLoading(false)
    }

    console.log('the data:')
    console.log(data)
    setTaskChainData(data)
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

    console.log('my final data')
    console.log(finalData)

    return

    // eslint-disable-next-line no-unreachable
    let ipfsHashData
    // try {
    //   const res = await formsUploadIPFS(finalData)
    //   console.log('a resposta:')
    //   console.log(res)
    //   ipfsHashData = res
    //   await setIpfsHashTaskData(res)
    // } catch (err) {
    //   toast.error('something ocurred')
    //   console.log(err)
    //   setIsLoading(false)
    // }

    // try {
    //   await handleCreateTask(
    //     ipfsHashData,
    //     Math.floor(data.deadline.getTime() / 1000),
    //     payments,
    //   )
    //   toast.success('Application done succesfully!')
    // } catch (err) {
    //   toast.error('Error during the task application')
    //   console.log(err)
    //   setIsLoading(false)
    // }
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      console.log('search for the task info on blockchain')
      console.log(id.id)
      getTaskFromChain(id.id)
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

export default TaskApplication
