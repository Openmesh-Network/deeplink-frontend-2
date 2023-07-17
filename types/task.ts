export type Payment = {
  tokenContract: string
  amount: string
  decimals: number | 18
}

export type Link = {
  title: string
  url: string
}

export type IPFSSubmition = {
  title: string
  description: string
  deadline: Date
  departament: string
  skills: string[]
  type: string
  payments: Payment[]
  links: Link[] | null
  file: string | null
}

export type TasksOverview = {
  id: string
  title: string
  description: string
  deadline: string
  departament: string
  status: string
  skills: string[]
  type: string
  payments: Payment[]
}

export type TransactionHistory = {
  actionIcon: string
  actionName: string
  transactionHash: string
  transactionDate: string
  addressSender: string
}
