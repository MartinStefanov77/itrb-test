type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className = "section-header" }: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className="section-heading">{title}</h2>
      {subtitle ? <p className="section-sub">{subtitle}</p> : null}
    </div>
  );
}
