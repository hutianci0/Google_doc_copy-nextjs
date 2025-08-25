'use client'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Separator } from '@/components/ui/separator'

import { RemoveDialog } from '@/app/components/remove-dialog'
import { RenameDialog } from '@/app/components/rename-dialog'
import { useEditorStore } from '@/store/use-editor-store'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  Strikethrough,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsFilePdf } from 'react-icons/bs'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'
import { Avatars } from './avatars'
import { DocumentInput } from './document-input'
import { Inbox } from './inbox'

interface NavbarProps {
  data: Doc<'documents'>
}
export const Navbar = ({ data }: NavbarProps) => {
  const router = useRouter()
  const { editor } = useEditorStore()
  const mutation = useMutation(api.documents.create)
  const onCreate = async () => {
    const id = await mutation({ title: 'Untitled Document', initialContent: '' })
    router.push(`/documents/${id}`)
  }
  const inserTable = ({ rows, cols }: { rows: number; cols: number }) => {
    if (editor) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run()
    }
  }

  const onDownload = (blog: Blob, fileName: string) => {
    // 1. 创建一个临时的 URL，用来指向内存中的 Blob 对象
    const url = URL.createObjectURL(blog)

    // 2. 动态创建一个 <a> 标签
    const a = document.createElement('a')

    // 3. 把 <a> 标签的 href 设置为刚才生成的 URL
    a.href = url

    // 4. 设置 <a> 的 download 属性，这样点击时会触发下载，而不是跳转页面
    a.download = fileName

    // 5. 模拟用户点击 <a> 标签，触发下载动作
    a.click()

    // 6. 下载完成后，记得释放刚才创建的 URL 对象，避免内存泄漏
    URL.revokeObjectURL(url)
  }

  /* Save file
   * 1. Get file content
   * 2. Create blob
   * 3. Create url
   * 4. Create a tag
   */
  const onSaveJSON = () => {
    if (!editor) return
    const content = editor.getJSON()
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' })
    onDownload(blob, `${data.title}.json`)
  }
  const onSaveHTML = () => {
    if (!editor) return
    const content = editor.getHTML()
    const blob = new Blob([content], { type: 'text/html' })
    onDownload(blob, `${data.title}.html`)
  }

  const onSaveText = () => {
    if (!editor) return
    const content = editor.getText()
    const blob = new Blob([content], { type: 'text/plain' })
    onDownload(blob, `${data.title}.txt`)
  }
  return (
    <nav className="flex items-center justify-between px-0.5">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src={'/logo.svg'} alt="Logo" width={36} height={36} className="w-auto h-auto" />
        </Link>
        <div className="flex flex-col">
          {/* Document Input */}
          <DocumentInput title={data.title} id={data._id} />
          {/* Menubar */}
          <div className="flex">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
              {/* file menu */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0,5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      {' '}
                      <FileIcon className="size-4 mr-4" /> Save
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={onSaveJSON}>
                        <FileJsonIcon className="size-4 mr-2" />
                        JSON
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="size-4 mr-2" />
                        HTML
                      </MenubarItem>
                      <MenubarItem onClick={() => window.print()}>
                        <BsFilePdf className="size-4 mr-2" />
                        PDF
                      </MenubarItem>
                      <MenubarItem>
                        <FileTextIcon className="size-4 mr-2" onClick={onSaveText} />
                        Text
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={onCreate}>
                    <FilePlusIcon className="mr-2  size-4" />
                    New file
                  </MenubarItem>
                  <MenubarSeparator />

                  <RenameDialog documentId={data._id} initialTitle={data.title}>
                    <MenubarItem onClick={(e) => e.stopPropagation()} onSelect={(e) => e.preventDefault()}>
                      <FilePenIcon className="size-4 mr-2" />
                      Rename
                    </MenubarItem>
                  </RenameDialog>
                  <RemoveDialog documentId={data._id}>
                    <MenubarItem onClick={(e) => e.stopPropagation()} onSelect={(e) => e.preventDefault()}>
                      <TrashIcon className="size-4 mr-2" />
                      Remove
                    </MenubarItem>
                  </RemoveDialog>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print <MenubarShortcut>⌘ P </MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              {/* Edit menu */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0,5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                    <Undo2Icon className="size-4 mr-2" />
                    Undo <MenubarShortcut>⌘ Z </MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                    <Redo2Icon className="size-4 mr-2" />
                    Redo <MenubarShortcut>⌘ Y </MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              {/* Insert Table Menu */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0,5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Table</MenubarSubTrigger>
                    <MenubarSubContent>
                      {Array.from({ length: 4 }, (_, i) => (
                        <MenubarItem key={i} onClick={() => inserTable({ rows: i + 1, cols: i + 1 })}>{`${i + 1} x ${
                          i + 1
                        }`}</MenubarItem>
                      ))}
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              {/* Format Menu */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0,5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="mr-2 size-4" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                        <BoldIcon className="mr-2 size-4" />
                        Bold <MenubarShortcut>⌘B</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                        <ItalicIcon className="mr-2 size-4" />
                        Italic <MenubarShortcut>⌘I</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                        <UnderlineIcon className="mr-2 size-4" />
                        Underline <MenubarShortcut>⌘U</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                        <Strikethrough className="mr-2 size-4" />
                        Strikethrough <MenubarShortcut>⌘S</MenubarShortcut>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                    <RemoveFormattingIcon className="siez-4" />
                    Clear Formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center pl-6">
        <Inbox />
        <Avatars />
        <Separator orientation="vertical" className="min-h-[36px] w-1" />
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
