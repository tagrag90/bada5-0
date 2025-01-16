interface ServiceCardProps {
  icon: string;
  name: string;
  description: string;
  url: string;
}

export default function ServiceCard({ icon, name, description, url }: ServiceCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block mb-4 last:mb-0">
      <div className="rounded-[20px] border-2 border-[#abb3bb] p-6 transition-all hover:shadow-md">
        <div className="flex flex-col items-start gap-4">
          <img src={icon} alt={name} className="h-10 w-10 rounded-md" />
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-black">{name}</h3>
            <p className="text-sm text-[#abb3bb]">{description}</p>
            <p className="text-sm text-[#abb3bb]">{url}</p>
          </div>
        </div>
      </div>
    </a>
  );
} 