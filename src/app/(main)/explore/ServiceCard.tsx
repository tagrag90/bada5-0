import Image from 'next/image';

interface ServiceCardProps {
  icon: string;
  name: string;
  description: string;
  url: string;
}

export default function ServiceCard({ icon, name, description, url }: ServiceCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block mb-4 last:mb-0">
      <div className="rounded-lg border p-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12">
            <Image
              src={icon}
              alt={name}
              fill
              className="rounded-lg"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-600">{description}</p>
            <p className="mt-1 text-sm text-gray-400">{url}</p>
          </div>
        </div>
      </div>
    </a>
  );
} 