import { Home, Brain, Briefcase, Cpu, Building2, ShoppingCart, Settings, Layers } from "lucide-react";

export type TabId = "uebersicht" | "epochen" | "skills" | "projekte" | "kernel" | "unternehmen" | "shop" | "einstellungen";

type NavItem = {
  id: TabId;
  label: string;
  icon: typeof Home;
};

const NAV_ITEMS: NavItem[] = [
  { id: "uebersicht",    label: "Übersicht",    icon: Home },
  { id: "epochen",       label: "Epochen",      icon: Layers },
  { id: "skills",        label: "Skills",       icon: Brain },
  { id: "projekte",      label: "Aufträge",     icon: Briefcase },
  { id: "kernel",        label: "Kernel",       icon: Cpu },
  { id: "unternehmen",   label: "Unternehmen",  icon: Building2 },
  { id: "shop",          label: "Shop",         icon: ShoppingCart },
  { id: "einstellungen", label: "Einstellungen",icon: Settings },
];

type BottomNavProps = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="flex items-center justify-around rounded-2xl border border-[#E0B84A]/15 bg-[#111111]/95 px-1 py-1.5 backdrop-blur-sm">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-all
              ${isActive ? "text-[#E0B84A]" : "text-[#B9B2A3] hover:text-[#F5F3EE]"}`}
          >
            <div className={`rounded-xl p-1 transition-colors ${isActive ? "bg-[#E0B84A]/15" : ""}`}>
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span className="text-[9px] font-semibold tracking-wide leading-none">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
