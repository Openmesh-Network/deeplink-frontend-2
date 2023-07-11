'use client'
/* eslint-disable prettier/prettier */
import { useState } from 'react'
import TransactionModal from './TransactionModal'

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
      actionName: 'Contributor Applied',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213217',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 4,
      actionIcon: 'FormOutlined',
      actionName: 'Contributor Applied',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213217',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 5,
      actionIcon: 'FormOutlined',
      actionName: 'Contributor Applied',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213127',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 6,
      actionIcon: 'FormOutlined',
      actionName: 'Contributor Applied',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C213127',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
      id: 7,
      actionIcon: 'FormOutlined',
      actionName: 'Contributor Applied',
      transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
      transactionDate: '2023-07-01 10:14:52',
    },
    {
        id: 8,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 9,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 10,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 11,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 12,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 14,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 15,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 16,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 17,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 18,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },
      {
        id: 19,
        actionIcon: 'FormOutlined',
        actionName: 'Contributor Applied',
        transactionHash: '0x8Cd914F504e06397952C2aaEb3Aea6cC3B5bD5C32137',
        transactionDate: '2023-07-01 10:14:52',
      },

  ])

  return (
    <div className="my-4 py-6 w-2/3">
      <h2 className="mb-4 text-left text-base font-medium text-black">
        All activities
      </h2>
      <div className="h-[400px] overflow-auto pr-2 text-[#f3f1f1] scrollbar-thin scrollbar-thumb-current">
        {transactions.map((transaction) => (
          <TransactionModal key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  )
}

export default TransactionList
