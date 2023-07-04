'use client'
import { useState } from 'react'
import TransactionModal from './TransactionModal'
import SearchModal from './SearchModal'

const TransactionList = () => {
  const [transactions] = useState([
    {
      id: 1,
      actionIcon: 'FormOutlined',
      actionName: 'Task created',
      transactionHash:
        '0x3D75507A8AdcD2F83bd71029a9a8fDcBaaaadf6393C2131236fdfssfssfffsfsffs',
      transactionDate: '2023-07-01 09:32:01',
    },
    {
      id: 2,
      actionIcon: 'FormOutlined',
      actionName: 'Task submitted',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 3,
      actionIcon: 'FormOutlined',
      actionName: 'Task submitted',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213217',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 4,
      actionIcon: 'FormOutlined',
      actionName: 'Task submitted',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213217',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 5,
      actionIcon: 'FormOutlined',
      actionName: 'Task submitted',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213127',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 6,
      actionIcon: 'FormOutlined',
      actionName: 'Task submitted',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213127',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 7,
      actionIcon: 'FormOutlined',
      actionName: 'Task submitted',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
      transactionDate: '2023-07-01 10:14:52',
    },
  ])

  return (
    <div className="mx-auto mt-44 max-w-6xl items-center justify-center py-6">
      <div className="mb-5 ml-4 flex justify-between border-b border-body-color border-opacity-50 pb-2">
        <h2 className=" mb-2 text-left text-lg font-semibold text-white lg:text-5xl lg:font-bold">
          Tasks
        </h2>
        <button className="duration-80  my-2 cursor-pointer rounded-md border border-transparent bg-primary  px-6 text-center text-sm font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none">
          New task
        </button>
      </div>
      <SearchModal />
      <div className="h-[400px] overflow-auto pr-2 scrollbar scrollbar-thumb-dark">
        {transactions.map((transaction) => (
          <TransactionModal key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  )
}

export default TransactionList
