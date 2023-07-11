'use client'
import ScrollUp from '@/components/Common/ScrollUp'
import { useRouter } from 'next/navigation'
import { Inter } from '@next/font/google'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function Task() {
  const router = useRouter()
  router.push('/')
  return (
    <>
      <ScrollUp />
    </>
  )
}
