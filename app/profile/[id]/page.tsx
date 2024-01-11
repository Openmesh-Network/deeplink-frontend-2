'use client'

/* eslint-disable no-unused-vars */
import ScrollUp from '@/components/Common/ScrollUp'
import { Inter } from '@next/font/google'
import ProfileView from '@/components/Profile'

export default function Profile({ params }) {
  return (
    <>
      <ScrollUp />
      <ProfileView id={params.id} />
    </>
  )
}
