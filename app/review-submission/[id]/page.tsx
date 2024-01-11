'use client'

import ScrollUp from '@/components/Common/ScrollUp'
import SubmissionRevision from '@/components/SubmissionRevision'

export default function UserPage({ params }) {
  console.log(params.id)
  return (
    <>
      <ScrollUp />
      <SubmissionRevision id={params.id} />
    </>
  )
}
