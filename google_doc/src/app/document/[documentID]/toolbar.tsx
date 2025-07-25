'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/store/use-editor-store'
import { Level } from '@tiptap/extension-heading'

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquareIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from 'lucide-react'
import { useState } from 'react'
import { CirclePicker, ColorResult } from 'react-color'

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

const FontColorButton = () => {
  const { editor } = useEditorStore()

  const color = editor?.getAttributes('textStyle').color || '#0000000'
  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="text-sm h-7 shrink-0 min-w-7 flex flex-col justify-center items-center rounded-sm bg-neutral-200/80 hover:bg-neutral-200/80 hover:cursor-pointer ">
            <span style={{ color: color }}>
              A
              <div className="min-h-0.5 w-full" style={{ backgroundColor: color, color }} />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5">
          <CirclePicker color={color} onChange={onChange} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const HighlightButton = () => {
  const { editor } = useEditorStore()

  const color = '#0000000'
  const onChange = (color: ColorResult) => {
    editor?.chain().focus().toggleHighlight({ color: color.hex }).run()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="text-sm h-7 shrink-0 min-w-7 flex flex-col justify-center items-center rounded-sm bg-neutral-200/80 hover:bg-neutral-200/80 hover:cursor-pointer ">
            <HighlighterIcon size={4} style={{ color: editor?.getAttributes('highlight').color || '#0000000' }} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5">
          <CirclePicker color={color} onChange={onChange} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const LinkButtion = () => {
  const { editor } = useEditorStore()
  const [link, setLink] = useState<string>('')
  const onChange = (href: string) => {
    editor?.chain().extendMarkRange('link').setLink({ href }).run()
    setLink('')
  }
  return (
    <>
      {/* 实现复写: 重点在于写在哪个组件 */}
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            setLink(editor?.getAttributes('link').href || '')
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button className="text-sm h-7 shrink-0 min-w-7 flex flex-col justify-center items-center rounded-sm bg-neutral-200/80 hover:bg-neutral-200/80 hover:cursor-pointer text-primary">
            <Link2Icon size={4} style={{ color: editor?.getAttributes('link').color || '#0000000' }} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
          <Input placeholder="https://example.com" value={link} onChange={(e) => setLink(e.target.value)} />
          <Button onClick={() => onChange(link)}>submit</Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const ImageButton = () => {
  const { editor } = useEditorStore()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [imgURL, setURL] = useState<string>('')

  // 插入图片1: 输入地址
  const onChange = (src: string) => {
    editor?.chain().setImage({ src }).run()
    setURL('')
  }

  // 插入图片2: 本地文件
  const onUpload = () => {
    // 原生创建input file
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    //设置事件
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const imgURL = URL.createObjectURL(file)
        onChange(imgURL)
      }
    }

    input.click()
  }

  const handleImageURLsubmit = () => {
    if (imgURL) {
      onChange(imgURL)
      setURL('')
      setIsDialogOpen(false)
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="text-sm h-7 shrink-0 min-w-7 flex flex-col justify-center items-center rounded-sm bg-neutral-200/80 hover:bg-neutral-200/80 hover:cursor-pointer text-primary">
            <ImageIcon size={4} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon className="size-4 mr-2" />
            Upload
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <SearchIcon className="size-4 mr-2" />
            Paste image URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* 实现复写: 重点在于写在哪个组件 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image URL</DialogTitle>
            <Input
              placeholder="image url"
              value={imgURL}
              onChange={(e) => setURL(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleImageURLsubmit()
                }
              }}
            />
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleImageURLsubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// AlighButton: textAlign extension
const AlighButton = () => {
  const { editor } = useEditorStore()
  // alignments: label,valeu, icon
  const AlignOptions = [
    {
      label: 'Left',
      value: 'left',
      icon: AlignLeftIcon,
    },
    {
      label: 'Center',
      value: 'center',
      icon: AlignCenterIcon,
    },
    {
      label: 'Right',
      value: 'right',
      icon: AlignRightIcon,
    },
    {
      label: 'Justify',
      value: 'justify',
      icon: AlignJustifyIcon,
    },
  ]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="text-sm text-primary h-7 shrink-0 min-w-7 flex flex-col justify-center items-center rounded-sm bg-neutral-200/80 hover:bg-neutral-200/80 hover:cursor-pointer ">
            <AlignCenterIcon size={4} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5">
          {AlignOptions.map(({ label, value, icon: Icon }) => {
            return (
              <DropdownMenuItem key={value} onClick={() => editor?.chain().focus().setTextAlign(value).run()}>
                <Icon className="size-4 mr-2" />
                {label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

// ListButoon: native editor functions
const ListButoon = () => {
  const { editor } = useEditorStore()
  const ButtonOpt = [
    {
      label: 'Bullet List',
      icon: ListIcon,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive('bulletList') || false,
    },
    {
      label: 'Number List',
      icon: ListOrderedIcon,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: editor?.isActive('orderedList') || false,
    },
  ]
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="text-sm text-primary h-7 shrink-0 min-w-7 flex flex-col justify-center items-center rounded-sm bg-neutral-200/80 hover:bg-neutral-200/80 hover:cursor-pointer ">
            <ListIcon size={4} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5">
          {ButtonOpt.map(({ label, icon: Icon, onClick, isActive }) => {
            return (
              <DropdownMenuItem key={label} onClick={onClick} className={cn(isActive && 'bg-neutral-200/80')}>
                <Icon className="size-4 mr-2" />
                {label}
              </DropdownMenuItem>
            )
          })}
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
      <FontColorButton />
      <HighlightButton />

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />
      <FontFamilyButton />

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />
      <HeadingButton />

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />
      <LinkButtion />
      <ImageButton />

      <Separator orientation="vertical" className="min-h-6 bg-neutral-300" />
      <AlighButton />
      <ListButoon />
    </div>
  )
}
