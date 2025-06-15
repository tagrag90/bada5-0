import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  name: string;
  description: string;
  url: string;
}

export default function ServiceCard({
  name,
  description,
  url,
}: ServiceCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-bold">{name}</h4>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </a>
  );
} 