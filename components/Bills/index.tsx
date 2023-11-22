/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
'use client'
import { useEffect, useState } from 'react'

const Bills = () => {
  // você pode adicionar mais configurações ao iframe se necessário
  return (
    <div className="flex h-screen items-center justify-center">
      {' '}
      {/* Centraliza o iframe na tela */}
      <iframe
        src="https://openmesh-bills.vercel.app/"
        title="OpenMesh Bills"
        className="h-full w-full"
        frameBorder="0"
      ></iframe>
    </div>
  )
}

export default Bills
