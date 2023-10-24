/* eslint-disable no-undef */
'use client'

import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'

import { Providers } from './providers'
import NewFooter from '@/components/NewFooter'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className="bg-white">
        <Providers>
          <Header />
          {children}
          <NewFooter />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
