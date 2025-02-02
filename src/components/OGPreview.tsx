import Image from "next/image";
import Link from "next/link";

export interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

export default function OGPreview({ ogData }: { ogData: OGData }) {
  if (!ogData.title && !ogData.description && !ogData.image) return null;

  return (
    <Link
      href={ogData.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 block overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50"
    >
      <div className="flex">
        {ogData.image && (
          <div className="relative h-[120px] w-[120px] flex-shrink-0">
            <Image
              src={ogData.image}
              alt={ogData.title || ''}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-3">
          {ogData.title && (
            <h3 className="mb-1 line-clamp-2 text-sm font-semibold">
              {ogData.title}
            </h3>
          )}
          {ogData.description && (
            <p className="line-clamp-2 text-sm text-gray-600">
              {ogData.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {new URL(ogData.url).hostname}
          </p>
        </div>
      </div>
    </Link>
  );
} 