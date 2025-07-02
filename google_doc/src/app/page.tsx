import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div className='flex text-center w-full h-screen'>
        <Link
          href={'/document/1'}
          className='m-auto text-3xl underline text-blue-500'
        >
          Go document id:1
        </Link>
      </div>
    </>
  )
}
