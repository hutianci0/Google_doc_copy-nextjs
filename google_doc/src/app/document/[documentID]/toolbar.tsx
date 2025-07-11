'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/use-editor-store';

import {
  BoldIcon,
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
} from 'lucide-react';

interface ToolBarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
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
  );
};

export default function ToolBar() {
  const { editor } = useEditorStore();

  const toggleSpellcheck = () => {
    const dom = editor?.view.dom;
    if (!dom) return;
    const current = dom.getAttribute('spellcheck');
    dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false');
  };

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive: boolean;
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
  ];

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
    </div>
  );
}
