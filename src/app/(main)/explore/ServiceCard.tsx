import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ServiceCardProps {
  name: string;
  description: string;
  url: string;
}

export default function ServiceCard({ 
  name, 
  description, 
  url
}: ServiceCardProps) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block transition-transform hover:scale-[1.02] duration-200"
    >
      <div className="rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 h-full bg-[#f1f1f1]">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-black">{name}</h3>
            <ExternalLink className="h-4 w-4 text-black" />
          </div>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
          <p className="mt-2 text-xs text-gray-500">
            {url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
          </p>
        </div>
      </div>
    </a>
  );
} 