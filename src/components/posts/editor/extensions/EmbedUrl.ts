import { Node, mergeAttributes } from '@tiptap/core';

export interface EmbedUrlOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embedUrl: {
      /**
       * 임베드 URL 노드를 추가합니다
       */
      setLinkPreview: (attributes: { url: string; title?: string; description?: string; image?: string }) => ReturnType;
    };
  }
}

export const EmbedUrl = Node.create<EmbedUrlOptions>({
  name: 'embedUrl',
  group: 'block',
  selectable: true,
  draggable: true,
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed-url"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': 'embed-url' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      '',
    ];
  },

  addCommands() {
    return {
      setLinkPreview:
        (attributes) => 
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
}); 