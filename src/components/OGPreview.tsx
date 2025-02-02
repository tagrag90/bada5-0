import Image from "next/image";

export interface OGData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName?: string;
}

interface OGPreviewProps {
  ogData: OGData;
}

export default function OGPreview({ ogData }: OGPreviewProps) {
  return (
    <a 
      href={ogData.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50"
    >
      {ogData.image && (
        <div className="relative h-40 w-full">
          <Image
            src={ogData.image}
            alt={ogData.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold line-clamp-2">{ogData.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{ogData.description}</p>
        {ogData.siteName && (
          <p className="mt-2 text-xs text-gray-400">{ogData.siteName}</p>
        )}
      </div>
    </a>
  );
} 