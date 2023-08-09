'use client'
import { Payment } from '@/types/task'

interface TasksModalProps {
  task: {
    internalId: string
    id: number
    title: string
    description: string
    deadline: string
    daysLeft: string
    isDraft: boolean
    payments: Payment[]
    status: string
    estimatedBudget: string
    skills: string[]
  }
  index: number
  isLoading: boolean
}

const TasksModal = ({ task, index, isLoading }: TasksModalProps) => {
  return (
    <div
      className={`relative mr-1 ${
        index === 0 ? 'mt-[34px]' : 'mt-[25px]'
      } flex items-start justify-between border-b border-[#D4D4D4] pb-6 text-[16px] font-normal`}
    >
      <div className="mr-4 w-[35%] items-center">
        <p
          title={task.title}
          className="overflow-hidden pb-2 font-bold text-[#0354EC] line-clamp-1"
        >
          {task.title}
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
          className="max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap"
          title={task.skills && task.skills.join(' | ')}
        >
          {task.skills && task.skills.join(', ')}
        </p>
      </div>
      <div className=" flex w-[10%] items-center">
        {task.estimatedBudget && (
          <div className="flex">
            <p key={index}>$</p>
            <p
              title={Number(task.estimatedBudget).toLocaleString('en-US')}
              className="mr-1 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
              key={index}
            >
              {Number(task.estimatedBudget).toLocaleString('en-US')}
            </p>
            <p>{`(`}</p>
            <img
              src="/images/tokens/usd-coin-usdc-logo.svg"
              alt="image"
              className={`w-[14px]`}
            />
            <p>{`)`}</p>
          </div>
        )}
      </div>
      <div className="flex w-[8%] items-center">{task.daysLeft}</div>
      <div className="flex w-[12%]">
        <a
          href={
            task.isDraft ? `/task/${task.id}` : `/task-draft/${task.internalId}`
          }
          target="_blank"
          rel="nofollow noreferrer"
          className="ml-auto cursor-pointer rounded-[5px] border border-[#0354EC] bg-white py-[10px] px-[22px] text-[16px] font-normal text-[#0354EC] hover:bg-[#0354EC] hover:text-white"
        >
          View more
        </a>
      </div>
    </div>
  )
}

export default TasksModal
