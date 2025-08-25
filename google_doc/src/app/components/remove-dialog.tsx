'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { useMutation } from 'convex/react'
import { ConvexError } from 'convex/values'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

interface RemoveDialogProps {
  documentId: Id<'documents'>
  children: React.ReactNode
}
export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
  const remove = useMutation(api.documents.deleteById)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const onDelete = async () => {
    try {
      setIsDeleting(true)
      await remove({ id: documentId })
      toast.success('Document deleted')
      setIsDeleting(false)
      router.push('/')
    } catch (e) {
      const convexError = e instanceof ConvexError ? e.data : 'unknown error'
      toast.error(convexError, {
        description: 'ask your admin for permission',
        action: {
          label: 'refresh',
          onClick: () => {
            console.log('clicked')
            router.refresh()
          },
        },
      })
    }
  }
  return (
    <AlertDialog>
      {/* re-useable */}
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permenantly delete your{' '}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
