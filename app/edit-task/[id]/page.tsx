'use client'

import ScrollUp from '@/components/Common/ScrollUp'
import EditTask from '@/components/EditTask'

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <ScrollUp />
      <EditTask id={params.id} />
    </>
  )
}
