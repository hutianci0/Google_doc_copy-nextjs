import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { SearchInput } from './search-input'
export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full h-full">
      {/*  */}
      <div className="flex items-center gap-3 shrink-0 pr-6">
        <Link href="/">
          <Image src={'/logo.svg'} alt="Logo" width={36} height={36} className="w-auto h-auto" />
        </Link>
        <h3 className="text-lg">Docs</h3>
      </div>
      {/*  */}
      <SearchInput />

      {/*  */}
      <div className="flex items-center gap-3 pl-6">
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        <UserButton />
      </div>
    </nav>
  )
}
