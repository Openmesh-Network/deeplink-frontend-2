/* eslint-disable no-unused-vars */
import ScrollUp from '@/components/Common/ScrollUp'
import { Inter } from '@next/font/google'
import TransactionList from '@/components/Profile'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function Profile() {
  return (
    <>
      <ScrollUp />
      <TransactionList />
    </>
  )
}
