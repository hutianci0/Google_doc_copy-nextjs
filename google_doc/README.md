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

# Shadcn

- Separator: vertical 时需要设置 min-h-xxx 才能显示
