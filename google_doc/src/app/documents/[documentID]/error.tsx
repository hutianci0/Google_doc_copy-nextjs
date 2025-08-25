'use client' // Error boundaries must be Client Components

import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <>
      {' '}
      <div role="alert" className="min-h-screen flex flex-col items-center justify-center gap-2">
        <p>Something went wrong:</p>
        <pre style={{ color: 'red' }}>{error.message}</pre>
        <Link href="/">try again</Link>
        <p>or</p>
        <SignOutButton>login again</SignOutButton>
      </div>
    </>
  )
}
