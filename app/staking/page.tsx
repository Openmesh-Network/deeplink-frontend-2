/* eslint-disable no-unused-vars */
import ScrollUp from '@/components/Common/ScrollUp'
import { Inter } from '@next/font/google'
import EmblaCarousel from '@/components/Carousel'
import TransactionList from '@/components/TasksOverview3'
import UpdatesList from '@/components/TaskView/UpdatesList'
import UpdatesOverview from '@/components/UpdatesOverview'
import Staking from '@/components/Staking'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function StakingPage() {
  return (
    <>
      <ScrollUp />
      <Staking />
    </>
  )
}
