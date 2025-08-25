import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ExternalLinkIcon, FilePenIcon, MoreVertical, TrashIcon } from 'lucide-react'
import { Id } from '../../../convex/_generated/dataModel'
import { RemoveDialog } from '../components/remove-dialog'
import { RenameDialog } from '../components/rename-dialog'

interface DocumentMenuProps {
  documentId: Id<'documents'>
  title: string
  onNewTab: (documentId: Id<'documents'>) => void
}
export const DocumentMenu = ({ documentId, title, onNewTab }: DocumentMenuProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical size={4} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onNewTab(documentId)
          }}
          className="flex justify-center items-center "
          onSelect={(e) => e.preventDefault()}
        >
          <ExternalLinkIcon className="size-4 mr-2" /> Open in a new tab
        </DropdownMenuItem>

        <RemoveDialog documentId={documentId}>
          <DropdownMenuItem
            className="flex align-middle items-center"
            onClick={(e) => e.stopPropagation()}
            onSelect={(e) => e.preventDefault()}
          >
            <TrashIcon className="size-4 mr-2" /> Delete
          </DropdownMenuItem>
        </RemoveDialog>

        <RenameDialog documentId={documentId} initialTitle={title}>
          <DropdownMenuItem
            className="flex align-middle items-center"
            onClick={(e) => e.stopPropagation()}
            onSelect={(e) => e.preventDefault()}
          >
            <FilePenIcon className="size-4 mr-2" /> Rename
          </DropdownMenuItem>
        </RenameDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
