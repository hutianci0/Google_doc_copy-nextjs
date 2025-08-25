'use client'

import { getDocuments, getUsers } from '@/utils/actions'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense'
import { LoaderIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Id } from '../../../../convex/_generated/dataModel'

type User = { id: string; name: string; avatar: string; color?: string }
export function Room({ children }: { children: ReactNode }) {
  const documentID = useParams().documentID as string
  const [users, setUsers] = useState<User[]>([])
  const fetchUers = useMemo(
    () => async () => {
      try {
        const list = await getUsers()
        setUsers(list)
      } catch {
        toast.error('Error fetching users')
      }
    },
    [],
  )

  useEffect(() => {
    fetchUers()
  }, [fetchUers])

  return (
    <LiveblocksProvider
      throttle={16}
      // authEndpoint={'/api/liveblocks-auth'}
      authEndpoint={async () => {
        const endPoint = '/api/liveblocks-auth'
        const room = documentID
        const response = await fetch(endPoint, {
          method: 'POST',
          body: JSON.stringify({ room }),
        })

        return await response.json()
      }}
      resolveUsers={({ userIds }) => userIds.map((id) => users.find((user) => user.id === id)) ?? undefined}
      resolveMentionSuggestions={({ text }) => {
        return users.filter((user) => user.name.includes(text)).map((user) => user.id)
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<'documents'>[])
        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }))
      }}
    >
      {/* will send this in the body in authentication routes */}
      <RoomProvider id={documentID} initialStorage={{ leftMargin: 56, rightMargin: 56 }}>
        <ClientSideSuspense
          fallback={
            <div className="min-h-screen flex flex-col items-center justify-center gap-2">
              <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground text-sm">Room Loading... </p>
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
