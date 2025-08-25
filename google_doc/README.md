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

- 配置 color: reac-color + color extension
- 配置 link

```jsx
const LinkButtion = () => {
  const { editor } = useEditorStore()
  const [link, setLink] = useState < string > (editor?.getAttributes('link').href || '')
  const onChange = (href: string) => {
    editor?.chain().extendMarkRange('link').setLink({ href }).run()
    setLink('')
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="text-sm h-7 shrink-0 min-w-7 flex flex-col justify-center items-center rounded-sm bg-neutral-200/80 hover:bg-neutral-200/80 hover:cursor-pointer ">
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
```

- 上传图片

```jsx
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

```

- 下载文件

```jsx
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
```

- 动态设置样式使用原生 style 而不是静态 tailwind
- `getBoundingClientRect`: 获取元素相对于视口的距离
- `e.clientX` 和 `e.clientY`: 获取鼠标相对于 event 的坐标

# Shadcn

- Separator: vertical 时需要设置 min-h-xxx 才能显示
- Dialog嵌套MenuItem时, 需要在item设置"e => e.preventDefault()"来阻止默认行为

# NavBar

- logo: logoipsum
- table: tiptap `insertTable`方法

# Tailwind

```css
[&_svg]:size-5
/* 等效于 */
.Button svg {
  width: 1.25rem; /* 20px */
  height: 1.25rem;
}
```

- [...] → 任意变体语法（Arbitrary Variant），可以写任何合法的 CSS 选择器。
- &\_svg → 这里的 & 代表当前元素（也就是这个 Button），svg 是后代选择器。所以 &\_svg 就等于 “选择这个按钮里的所有`svg`元素
- size-5 → Tailwind 的工具类，size-5 = width: 1.25rem; height: 1.25rem;。

# Convex

详情见obsidian 笔记
