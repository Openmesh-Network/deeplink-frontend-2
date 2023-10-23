import React, { createContext, useState } from 'react'

export interface UserProps {
  firstName: string
  lastName: string
  email: string
  companyName: string
  foundingYear: number
  location: string
  website: string
  tags: string[]
  description: string
  password: string
  confirmPassword: string
  profilePictureHash: string
  calendly: string
  sessionToken: string
  createdAt: string
  updatedAt: string
}

interface CreateContextProps {
  children: React.ReactNode
}

interface CreateUserContextProps {
  selectionSideNavBar: string
  setSelectionSideNavBar: (value: string) => void

  next: boolean
  setNext: (value: boolean) => void

  user: UserProps | undefined
  setUser: (user: UserProps | undefined) => void
}

export const AccountContext = createContext({} as CreateUserContextProps)

export default function AccountContextProvider({
  children,
}: CreateContextProps) {
  const [user, setUser] = useState<UserProps>()
  const [selectionSideNavBar, setSelectionSideNavBar] =
    useState<string>('Start here')
  const [next, setNext] = useState<boolean>(false)
  return (
    <AccountContext.Provider
      value={{
        selectionSideNavBar,
        setSelectionSideNavBar,
        user,
        setUser,
        next,
        setNext,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
