import { Node, mergeAttributes } from "@tiptap/core";

export const YouTube = Node.create({
  name: "youtube",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        width: "100%",
        height: "315",
        frameborder: "0",
        allowfullscreen: "true",
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      }),
    ];
  },
});
