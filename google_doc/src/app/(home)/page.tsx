'use client'
import { usePaginatedQuery } from 'convex/react'
import { useSearchParams } from 'next/navigation'
import { Toaster } from 'sonner'
import { api } from '../../../convex/_generated/api'
import { DocumentTable } from './document-table'
import { Navbar } from './navbar'
import { TemplateGallary } from './teamplateGallery'

export default function Home() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')

  // usePaginatedQuery(convex function, addiational args, pagination)
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.documents.get,
    { search: search || '' },
    { initialNumItems: 5 },
  )

  if (isLoading) return <div>Loading...</div>
  return (
    <>
      <div className="flex flex-col  min-h-screen">
        <Toaster />
        <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
          <Navbar />
        </div>
        <div className="mt-16">
          <TemplateGallary />
          <DocumentTable results={results} loadMore={loadMore} status={status} />
        </div>
      </div>
    </>
  )
}
