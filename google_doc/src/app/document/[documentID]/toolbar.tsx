'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/store/use-editor-store'
import { Level } from '@tiptap/extension-heading'
import {
  BoldIcon,
  ChevronDownIcon,
  ItalicIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquareIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-react'

interface ToolBarButtonProps {
  onClick?: () => void
  isActive?: boolean
  icon: LucideIcon
}

const ToolBarButton = ({ onClick, isActive, icon: Icon }: ToolBarButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'text-sm h-7 min-w-7 flex items-center justify-center text-black rounded-sm hover:bg-neutral-200/80 hover:cursor-pointer',
        isActive ? 'bg-neutral-100' : 'bg-neutral-200/80',
      )}
    >
      <Icon className="size-4" />
    </Button>
  )
}

const FontFamilyButton = () => {
  const { editor } = useEditorStore()
  const FontOptions = [
    {
      label: 'Arial',
      value: 'Arial',
    },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Palatino', value: 'Palatino' },
    { label: 'Garamond', value: 'Garamond' },
    { label: 'Bookman', value: 'Bookman' },
  ]
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 w-[120px] shrink-0 items-center  flex justify-between rounded-sm  hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
            <span className="truncate">{editor?.getAttributes('textStyle').fontFamily || 'Arial'}</span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0 " />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1 flex flex-col gay-y-1">
          {FontOptions.map(({ label, value }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => {
                editor?.chain().focus().setFontFamily(value).run()
              }}
            >
              {/* only native css Tailwind cannot do */}
              <span style={{ fontFamily: value }}>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const HeadingButton = () => {
  const { editor } = useEditorStore()
  // textSize style in dropdowns and textareas
  const HeadingOptions = [
    {
      label: 'Normal text',
      value: 0,
      textSize: '16px',
    },
    {
      label: 'Heading 1',
      value: 1,
      textSize: '32px',
    },
    {
      label: 'Heading 2',
      value: 2,
      textSize: '24px',
    },
    {
      label: 'Heading 3',
      value: 3,
      textSize: '20px',
    },
    {
      label: 'Heading 4',
      value: 4,
      textSize: '18px',
    },
    { label: 'Heading 5', value: 5, textSize: '16px' },
  ]

  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level) {
      if (editor?.isActive('heading', { level })) {
        return `Heading ${level}`
      }

      return 'Normal text'
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 w-[120px] shrink-0 items-center  flex justify-between rounded-sm  hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
            <span className="truncate">{getCurrentHeading()}</span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0 " />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1 flex flex-col gay-y-1">
          {HeadingOptions.map(({ label, value, textSize }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => {
                if (value === 0) {
                  editor?.chain().focus().setParagraph().run()
                } else {
                  editor
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: value as Level })
                    .run()
                }
              }}
            >
              <span style={{ fontSize: textSize }}>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
export default function ToolBar() {
  const { editor } = useEditorStore()

  const toggleSpellcheck = () => {
    const dom = editor?.view.dom
    if (!dom) return
    const current = dom.getAttribute('spellcheck')
    dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false')
  }

  const sections: {
    label: string
    icon: LucideIcon
    onClick: () => void
    isActive: boolean
  }[][] = [
    // === Left group ===
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
        onClick: toggleSpellcheck,
        isActive: editor?.view.dom.getAttribute('spellcheck') === 'true',
      },
    ],
    // === Right group ===
    [
      {
        label: 'Bold',
        icon: BoldIcon,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: editor?.isActive('bold') || false,
      },
      {
        label: 'Italic',
        icon: ItalicIcon,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: editor?.isActive('italic') || false,
      },
      {
        label: 'Underline',
        icon: UnderlineIcon,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: editor?.isActive('underline') || false,
      },
    ],

    // === More groups ===
    [
      {
        label: 'Comment',
        icon: MessageSquareIcon,
        isActive: false,
        onClick: () => console.log('comment'),
      },
      {
        label: 'List ToDo',
        icon: ListTodoIcon,
        isActive: editor?.isActive('taskList') || false,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
      },

      {
        label: 'Remove Format',
        icon: RemoveFormattingIcon,
        isActive: true,
        onClick: () => editor?.chain().unsetAllMarks().run(),
      },
    ],
  ]

  return (
    <div className="flex items-center gap-x-1 overflow-x-auto rounded-[24px] bg-neutral-200/80 px-2.5 py-0.5 min-h-[40px]">
      {sections[0].map((item) => (
        <ToolBarButton key={item.label} {...item} />
      ))}

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />

      {sections[1].map((item) => (
        <ToolBarButton key={item.label} {...item} />
      ))}

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />
      {sections[2].map((item) => (
        <ToolBarButton key={item.label} {...item} />
      ))}

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />
      <FontFamilyButton />

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />
      <HeadingButton />
    </div>
  )
}
