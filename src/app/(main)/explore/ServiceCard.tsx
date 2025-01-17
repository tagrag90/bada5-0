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
      <div className="rounded-[20px] border border-[#8B95A1] p-6 transition-all hover:shadow-md">
        <div className="flex flex-col gap-4">
          <div className="relative h-10 w-10">
            <Image
              src={icon}
              alt={name}
              fill
              className="rounded-lg"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black">{name}</h3>
            <p className="text-[#8B95A1]">{description}</p>
            <p className="mt-1 text-sm text-[#8B95A1]">{url}</p>
          </div>
        </div>
      </div>
    </a>
  );
} 