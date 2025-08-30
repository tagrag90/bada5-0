import { ContactInfo } from "../privacy-data";

interface ContactCardProps {
  contact: ContactInfo;
}

export default function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{contact.role}</h3>
      <div className="space-y-2">
        <p><span className="font-medium">이름:</span> {contact.name}</p>
        <p><span className="font-medium">이메일:</span> 
          <a href={`mailto:${contact.email}`} className="text-primary hover:underline ml-1">
            {contact.email}
          </a>
        </p>
        {contact.note && (
          <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted rounded">
            📝 {contact.note}
          </p>
        )}
      </div>
    </div>
  );
}
