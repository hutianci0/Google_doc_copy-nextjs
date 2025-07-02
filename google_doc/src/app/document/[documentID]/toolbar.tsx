'use client'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/store/use-editor-store'

import {
  LucideIcon,
  PrinterIcon,
  Redo2Icon,
  SpellCheckIcon,
  Undo2Icon,
} from 'lucide-react'

interface iButton {
  onClick?: () => void
  isActive?: boolean
  icon: LucideIcon
}
const ToolBarButton = ({ onClick, isActive, icon: Icon }: iButton) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-sm h-7 min-w-7 flex items-center  justify-center rouded-sm hover:bg-neutral-200/80 hover:cursor-pointer text-black',
        isActive && 'bg-neutral-200/80',
      )}
    >
      <Icon className='size-4' />
    </button>
  )
}
export default function ToolBar() {
  const { editor } = useEditorStore()
  // console.log('editor', editor)

  const sections: {
    label: string
    icon: LucideIcon
    onClick: () => void
    isActive: boolean
  }[][] = [
    [
      {
        label: 'Undo',
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
        isActive: true,
      },
      {
        label: 'Redo',
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
        isActive: true,
      },
      {
        label: 'Print',
        icon: PrinterIcon,
        onClick: () => window.print(),
        isActive: true,
      },
      {
        label: 'SpellCheck',
        icon: SpellCheckIcon,
        onClick: () => {
          const dom = editor?.view.dom
          if (!dom) return
          // get and set global spellcheck attribute to toggle spellcheck
          const current = dom.getAttribute('spellcheck')
          dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false')
        },

        isActive: true,
      },
    ],
  ]
  return (
    <div className='bg-[#F1F4F9] text-background px-2.5 py-0.5  rounded-[24px] min-h-[40px] flex items-center gap-x-1 overflow-x-auto'>
      {sections[0].map((item) => (
        // {...item} = 等效于 label = {item.label} ...
        <ToolBarButton key={item.label} {...item} />
      ))}
    </div>
  )
}
