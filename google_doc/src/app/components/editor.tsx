'use client'

import { useEditorStore } from '@/store/use-editor-store'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'

const Tiptap = () => {
  const { setEditor } = useEditorStore()
  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor)
      editor.view.dom.setAttribute('spellcheck', 'false')
    },
    onDestroy() {
      setEditor(null)
    },
    onUpdate({ editor }) {
      setEditor(editor)
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor)
    },
    onTransaction({ editor }) {
      setEditor(editor)
    },
    onFocus({ editor }) {
      setEditor(editor)
    },
    onBlur({ editor }) {
      setEditor(editor)
    },
    onContentError({ editor }) {
      setEditor(editor)
    },
    editorProps: {
      attributes: {
        // dynamic and static style: one in Tailwind and one in classic format
        style: 'padding-left: 56px; padding-right: 56px',
        class:
          'focus:outline-none bg-white border border-[#C7C7C7] flex flex-col min-h-[1053px] w-[816px] pt-10 pr-15 pb-10 cursor-text ',
      },
    },
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      ImageResize,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({ multicolor: true }),
      TaskList,

      Table.configure({
        resizable: true,
      }),

      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),

      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: `
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>`,
  })
  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:px-0 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center w-[816px] py-4 mx-auto print:w-full print:min-w-0">
        <EditorContent
          editor={editor}
          // print styles for PDF
        />
      </div>
    </div>
  )
}

export default Tiptap
