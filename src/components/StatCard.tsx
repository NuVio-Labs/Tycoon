type StatCardProps = {
  label: string;
  value: number | string;
  accent?: boolean;
  icon?: string;
};

function StatCard({ label, value, accent, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#111111] p-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <p className="text-[11px] font-semibold tracking-[0.15em] text-[#B9B2A3] uppercase">{label}</p>
      </div>
      <p className={`mt-1.5 text-3xl font-black ${accent ? "text-[#E0B84A]" : "text-[#F5F3EE]"}`}>
        {typeof value === "number" ? value.toLocaleString("de-DE") : value}
      </p>
    </div>
  );
}

export default StatCard;
