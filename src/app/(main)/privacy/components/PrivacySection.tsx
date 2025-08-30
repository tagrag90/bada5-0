interface PrivacySectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function PrivacySection({ title, children, icon }: PrivacySectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-2xl">{icon}</div>}
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}
