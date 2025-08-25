'use client'
import Tiptap from '@/app/components/editor'
import { Preloaded, usePreloadedQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Navbar } from './navbar'
import { Room } from './Room'
import ToolBar from './toolbar'
interface documentProps {
  preloadDocument: Preloaded<typeof api.documents.getbyId>
}

// client component to display the document
export const Document = ({ preloadDocument }: documentProps) => {
  const document = usePreloadedQuery(preloadDocument)
  if (!document) return <div>No document Found</div>

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <Room>
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar data={document} />
          <ToolBar />
        </div>
        <div className="pt-[114px] print:pt-0">
          <Tiptap initialContent={document.initialContent} />
        </div>
      </Room>
    </div>
  )
}
