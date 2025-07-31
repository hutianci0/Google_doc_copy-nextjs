import { Extension } from '@tiptap/core'
import '@tiptap/extension-text-style'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setlineHeight: (lineHeight: string) => ReturnType
      unsetlineHeight: () => ReturnType
    }
  }
}

export const lineHeightExtension = Extension.create({
  name: 'fontHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: 'normal',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {}
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
            parseHTML: (element) => {
              return element.style.lineHeight || this.options.defaultLineHeight
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setlineHeight:
        (lineHeight: string) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { from, to } = selection

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight,
              })
            }
          })

          if (dispatch) {
            dispatch(tr)
          }

          return true
        },

      unsetlineHeight:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          tr = tr.setSelection(selection)
          const { from, to } = selection
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, lineHeight: this.options.defaultLineHeight })
            }
          })

          if (dispatch) dispatch(tr)
          return true
        },
    }
  },
})
