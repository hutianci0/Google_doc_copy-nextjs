'use client'
import { TableCell, TableRow } from '@/components/ui/table'
import { Building2Icon, CircleUserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SiGoogledocs } from 'react-icons/si'
import { Doc } from '../../../convex/_generated/dataModel'
import { DocumentMenu } from './document-menu'

interface DocumentRowProps {
  doc: Doc<'documents'>
}

const formatDate = (date: number) => {
  const options: Intl.DateTimeFormatOptions = {
    // weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(date))
}
export const DocumentRow = ({ doc }: DocumentRowProps) => {
  const router = useRouter()

  return (
    <TableRow className="cursor-pointer">
      <TableCell className="w-[50px]" onClick={() => router.push(`documents/${doc._id}`)}>
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>
      <TableCell className="font-medium md:w-[45%]" onClick={() => router.push(`documents/${doc._id}`)}>
        {doc.title}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
        {doc.organizationId ? <Building2Icon className="size-4" /> : <CircleUserIcon className="size-4" />}
        {doc.organizationId ? 'Organization' : 'Personal'}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">{formatDate(doc._creationTime)}</TableCell>
      <TableCell>
        <DocumentMenu
          documentId={doc._id}
          title={doc.title}
          onNewTab={() => window.open(`/documents/${doc._id}`, '_blank')}
        />
      </TableCell>
    </TableRow>
  )
}
