'use client'
import { useEffect, useState } from 'react'

interface TasksModalProps {
  id: number
  name: string
  description: string
  submitter: string
  deadline: string
  budget: string[]
  status: string
  logo: string
  categories: string[]
}

const TasksModal = (task: TasksModalProps, isLoading: boolean) => {
  const [daysLeft, setDaysLeft] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now()
      const deadline = Number(task.deadline) * 1000
      const distance = deadline - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))

      setDaysLeft(days <= 1 ? `${days} day left` : `${days} days left`)
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [task.deadline])

  return (
    <div className="relative mr-1 mb-8 flex items-start justify-between border-b border-[#D4D4D4] pb-6 text-[16px] font-normal">
      <div className="mr-4 w-[35%] items-center">
        <p
          title={task.name}
          className="overflow-hidden font-bold text-[#1068E6] line-clamp-1"
        >
          {task.name}
        </p>
        <p
          title={task.description}
          className="overflow-hidden text-[14px] !leading-tight line-clamp-2"
        >
          {task.description}
        </p>
      </div>
      <div className="flex w-[15%] items-center">
        <p
          className="overflow-hidden line-clamp-1"
          title={task.categories.join(' | ')}
        >
          {task.categories.join(', ')}
        </p>
      </div>
      <div className="flex w-[10%] items-center">
        {/* <p
          className="my-3 overflow-hidden  line-clamp-5 lg:line-clamp-6"
          title={task.budget.join(' | ')}
        >
          {task.budget.join(' | ')}
        </p> */}
        {task.budget.map((budg, index) => (
          <div key={index} className="flex">
            <p key={index}>$</p>
            <p className="mr-1" key={index}>
              {budg}
              {index !== task.budget.length - 1 && ', '}
            </p>
            <p>{`(`}</p>
            <img
              src="/images/tokens/usd-coin-usdc-logo.svg"
              alt="image"
              className={`w-[14px]`}
            />
            <p>{`)`}</p>
          </div>
        ))}
      </div>
      <div className="flex w-[8%] items-center">{daysLeft}</div>
      <div className="flex w-[12%]">
        <a
          href={`/task/${task.id}`}
          target="_blank"
          rel="nofollow noreferrer"
          className="ml-auto cursor-pointer rounded-md border border-[#0354EC] bg-white py-1 px-4 text-[#0354EC] hover:bg-[#0354EC] hover:text-white"
        >
          View more
        </a>
      </div>
    </div>
  )
}

export default TasksModal
