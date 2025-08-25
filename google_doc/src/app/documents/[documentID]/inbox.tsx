'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ClientSideSuspense } from '@liveblocks/react'
import { InboxNotification, InboxNotificationList } from '@liveblocks/react-ui'
import { useInboxNotifications } from '@liveblocks/react/suspense'
import { BellIcon, Loader2Icon } from 'lucide-react'

export const Inbox = () => {
  return (
    <ClientSideSuspense fallback={<Loader2Icon className="animate-spin" />}>
      <InboxMenu />
    </ClientSideSuspense>
  )
}

const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className="relative" size={'icon'}>
          <BellIcon />
          {inboxNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-sky-500 text-sm text-white flex items-center justify-center">
              {inboxNotifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        {inboxNotifications.length > 0 ? (
          <InboxNotificationList>
            {inboxNotifications.map((note) => (
              <InboxNotification key={note.id} inboxNotification={note} />
            ))}
          </InboxNotificationList>
        ) : (
          <div className="p-2 w-[400] text-center text-sm text-muted-foreground">No notifications</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
