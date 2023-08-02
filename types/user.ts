import { TasksOverview } from './task'

type VerifiedContributorSubmission = {
  description: string
  githubHTMLUrl: string
  status: string
}

export type User = {
  id: string | null
  name: string | null
  address: string | null
  profilePictureHash: string | null
  tags: string[] | null
  links: string[] | null
  joinedSince: string | null
  updatesNonce: string | null
  tasks: TasksOverview[]
  VerifiedContributorSubmission: VerifiedContributorSubmission[]
}
