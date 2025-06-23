'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        // dynamic and static style: one in Tailwind and one in classic format
        style: 'padding-left: 56px; padding-right: 56px',
        class:
          'focus:outline-none bg-white border border-[#C7C7C7] flex flex-col min-h-[1053px] w-[816px] pt-10 pr-15 pb-10 cursor-text ',
      },
    },
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
  })
  return (
    <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:px-0 print:bg-white print:overflow-visible'>
      <div className='min-w-max flex justify-center w-[816px] py-4 mx-auto print:w-full print:min-w-0'>
        <EditorContent
          editor={editor}
          // print styles for PDF
        />
      </div>
    </div>
  )
}

export default Tiptap
