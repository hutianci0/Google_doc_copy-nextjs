import Tiptap from '@/app/components/editor'
import { Navbar } from './navbar'
import ToolBar from './toolbar'

export default function Document() {
  return (
    <>
      <div className="min-h-screen bg-[#FAFBFD]">
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar />
          <ToolBar />
        </div>
        <div className="pt-[114px] print:pt-0">
          <Tiptap />
        </div>
      </div>
    </>
  )
}
