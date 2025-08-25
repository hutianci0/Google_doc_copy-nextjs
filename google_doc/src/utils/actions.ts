'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
const address = process.env.NEXT_PUBLIC_CONVEX_URL!
// Convex: fecth documents through HTTPS
const convex = new ConvexHttpClient(address)
// get users in the same organization
export const getUsers = async () => {
  const session = await auth()
  const clerk = await clerkClient()

  const UserList = await clerk.users.getUserList({ organizationId: [session.orgId as string] })

  return UserList.data.map((user) => ({
    id: user.id,
    name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Anonymos',
    avatar: user.imageUrl,
  }))
}

// fecth documents through Convex HTTPS client
export const getDocuments = async (ids: Id<'documents'>[]) => {
  return await convex.query(api.documents.getDocumentsByIds, { ids })
}
