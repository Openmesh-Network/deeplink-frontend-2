export type Payment = {
  tokenContract: string
  amount: string
  decimals: number | 18
}

export type Link = {
  title: string
  url: string
}

export type ContributorInfo = {
  address: string
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
  status: string | null
}

export type Application = {
  metadataDisplayName: string
  applicationId: string
  proposer: string
  applicant: string
  metadataDescription: string
  metadataProposedBudget: string
  timestamp: string
  totalEarned: string | null
  jobSuccess: string | null
  accepted: boolean
}

export type Submission = {
  submissionId: string
  proposer: string
  applicant: string
  metadataDescription: string
  metadataAdditionalLinks: string[]
  accepted: boolean
  timestamp: string
  reviewed: boolean
}

export type TasksOverview = {
  id: number
  title: string
  description: string
  deadline: string
  daysLeft: string
  departament: string
  status: string
  links: Link[] | null
  contributorsNeeded: string
  projectLength: string
  skills: string[]
  type: string
  payments: Payment[]
  estimatedBudget: string
  executor: string
  contributors: ContributorInfo[] | null
  Application: Application[] | null
  Submission: Submission[] | null
  updatesCount: number | null
}

export type Event = {
  name: string
  transactionHash: string
  address: string
  timestamp: string
}

export type TransactionHistory = {
  actionIcon: string
  actionName: string
  transactionHash: string
  transactionDate: string
  addressSender: string
}

export type TasksPagination = {
  currentPage: number
  totalPages: number
  totalTasks: number
  limit: number
}

export type Contributor = {
  walletAddress: string
  budgetPercentage: number
}

export type TasksCounting = {
  open: number
  active: number
  completed: number
}
