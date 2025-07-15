# Google Doc Copy

TipTap 配置

- 生命周期钩子: 把 editor 实例存入 store 实现工具栏访问
- 配置 Bold

```tsx
 {
        label: 'Bold',
        icon: BoldIcon,
        onClick: () => editor?.chain().focus().toggleBold().run(), // toggle text font
        isActive: editor?.isActive('bold') || false, // 通过 editor 获取当前状态来控制isActive的样式
      },
```

- 配置 Heading

```jsx
const HeadingButton = () => {
  const { editor } = useEditorStore()
  // textSize style in dropdowns and textareas
  const HeadingOptions = [
    {
      label: 'Normal text',
      value: 0,
      textSize: '16px',
    },
    // ....
    { label: 'Heading 5', value: 5, textSize: '16px' },
  ]

// 如果是fontFamily 直接通过editor.getAttributes('textStyle').fontFamily获取
  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level) {
      // 搜索isActive()
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
                    .toggleHeading({ level: value as Level }) // 需要下载heaidng-extension
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
```

# Shadcn

- Separator: vertical 时需要设置 min-h-xxx 才能显示
