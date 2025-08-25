import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { Document } from './document'

// server component to preload from Convex
export default async function DocumentWrapper({ params }: { params: Promise<{ documentID: Id<'documents'> }> }) {
  const { documentID } = await params
  const { getToken } = await auth()
  const token = (await getToken({ template: 'convex' })) ?? undefined
  if (!token) {
    throw new Error('DocumentWrapper: Not authenticated')
  }
  const preloadDocument = await preloadQuery(api.documents.getbyId, { id: documentID }, { token })
  return <Document preloadDocument={preloadDocument} />
}
