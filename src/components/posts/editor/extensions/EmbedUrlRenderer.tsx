"use client";

import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const EmbedUrlRenderer = ({ node }: NodeViewProps) => {
  const { url, title, description, image } = node.attrs;

  if (!url) return null;

  // URL 도메인 추출
  let domain = "";
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname.replace('www.', '');
  } catch (e) {
    console.error('Invalid URL:', url);
  }

  return (
    <NodeViewWrapper>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline my-2 border border-border rounded-lg overflow-hidden hover:bg-accent/5 transition-colors"
      >
        <div className="flex flex-col md:flex-row">
          {image && (
            <div className="relative w-full md:w-1/3 h-40">
              <Image 
                src={image}
                alt={title || url}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <span>{domain}</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </div>
            {title && <h3 className="text-base font-medium mb-1">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </a>
    </NodeViewWrapper>
  );
};

export default EmbedUrlRenderer; 