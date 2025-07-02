import Tiptap from '@/app/components/editor'
import ToolBar from './toolbar'

export default function Document() {
  return (
    <>
      This is document page
      <div className='min-h-screen bg-[#FAFBFD]'>
        <ToolBar />
        <Tiptap />
      </div>
    </>
  )
}
