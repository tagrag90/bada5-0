import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export interface LinkPreviewOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkPreview: {
      /**
       * 링크 미리보기 블록 추가
       */
      setLinkPreview: (options: { url: string, title?: string, description?: string, image?: string }) => ReturnType
    }
  }
}

export const LinkPreview = Node.create<LinkPreviewOptions>({
  name: 'linkPreview',
  
  group: 'block',
  
  draggable: true,
  
  addAttributes() {
    return {
      url: {
        default: null,
      },
      title: {
        default: null,
      },
      description: {
        default: null,
      },
      image: {
        default: null,
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="link-preview"]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'link-preview' }), '']
  },
  
  addCommands() {
    return {
      setLinkPreview: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
  
  addProseMirrorPlugins() {
    const linkPreviewPlugin = new PluginKey('linkPreview')
    
    return [
      new Plugin({
        key: linkPreviewPlugin,
        props: {
          handlePaste: (view, event) => {
            // 여기서는 붙여넣기 이벤트만 캡처하고, 
            // 실제 미리보기 데이터 가져오기는 PostEditor.tsx에서 처리합니다.
            return false
          },
        },
      }),
    ]
  },
})

export default LinkPreview 