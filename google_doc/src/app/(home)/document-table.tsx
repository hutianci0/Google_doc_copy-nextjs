import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoaderIcon } from 'lucide-react'
import { Doc } from '../../../convex/_generated/dataModel'
import { DocumentRow } from './document-row'

interface DocumentTableProps {
  results: Doc<'documents'>[] | undefined
  loadMore: (numItems: number) => void
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted'
}
export const DocumentTable = ({ results, loadMore, status }: DocumentTableProps) => {
  return (
    <div className="max-w-screen-2xl mx-auto px-16 py-6 flex flex-col gap-5">
      {results === undefined ? (
        <LoaderIcon className="animate-spin text-muted-foreground size-5 flex justify-center items-center h-24" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>Name</TableHead>
              <TableHead> &nbsp; </TableHead>
              <TableHead className="hidden md:table-cell">Shared</TableHead>
              <TableHead className="hidden md:table-cell">CreatedAt</TableHead>
            </TableRow>
          </TableHeader>
          {results.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  {' '}
                  No Documents found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {results.map((doc) => (
                <DocumentRow key={doc._id} doc={doc} />
              ))}
            </TableBody>
          )}
        </Table>
      )}
      <div className="flex items-center justify-center">
        <Button variant={'ghost'} size={'sm'} onClick={() => loadMore(5)} disabled={status !== 'CanLoadMore'}>
          {status === 'LoadingMore' ? 'Load More' : 'End of results'}
        </Button>
      </div>
    </div>
  )
}
