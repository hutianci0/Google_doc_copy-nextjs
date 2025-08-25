'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

interface RenameDialogProps {
  documentId: Id<'documents'>
  initialTitle: string
  children: React.ReactNode
}
export const RenameDialog = ({ documentId, children, initialTitle }: RenameDialogProps) => {
  const rename = useMutation(api.documents.UpdateTitleById)
  const [title, setTitle] = useState(initialTitle)
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    await rename({ id: documentId, title: title.trim() || 'Untitled' })
    setIsOpen(false)
    setIsUpdating(false)
  }
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      {/* re-useable */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* 如果不加会导致 点击事件propogate到 TableRow, 并且出发该元素绑定的click事件 */}
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename the document</DialogTitle>
            <DialogDescription>Give your document a better title </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <DialogFooter className="flex justify-between max-w-full">
            {' '}
            <Button type="submit">rename</Button>
            <Button
              disabled={isUpdating}
              variant="ghost"
              type="button"
              onClick={() => {
                setTitle(initialTitle)
                setIsOpen(false)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
