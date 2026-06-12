import type { RoomUpgrade } from "../types/upgrade";

export const roomUpgrades: RoomUpgrade[] = [
  // ── Fokus Maximum ────────────────────────────────────────────────────────
  {
    id: "focus-max-1", groupId: "focus-max", tier: 1,
    name: "Ergonomischer Stuhl", icon: "🪑",
    description: "Ein richtiger Gaming-Stuhl statt dem alten Holzstuhl. Du kannst länger fokussiert arbeiten.",
    cost: 80, owned: false, effect: { type: "focusMax", value: 20 },
  },
  {
    id: "focus-max-2", groupId: "focus-max", tier: 2,
    name: "Stehschreibtisch", icon: "🗂️",
    description: "Stehen statt sitzen hält den Kopf frei. Dein Fokus-Maximum steigt spürbar.",
    cost: 300, owned: false, effect: { type: "focusMax", value: 30 },
  },
  {
    id: "focus-max-3", groupId: "focus-max", tier: 3,
    name: "Lärm-Cancelling Kopfhörer", icon: "🎧",
    description: "Die Außenwelt existiert nicht mehr. Nur du und der Code.",
    cost: 700, owned: false, effect: { type: "focusMax", value: 50 },
  },
  {
    id: "focus-max-4", groupId: "focus-max", tier: 4,
    name: "Dediziertes Arbeitszimmer", icon: "🚪",
    description: "Endlich eine geschlossene Tür. Kein Lärm, keine Ablenkung, maximale Konzentration.",
    cost: 1500, owned: false, effect: { type: "focusMax", value: 75 },
  },
  {
    id: "focus-max-5", groupId: "focus-max", tier: 5,
    name: "Heimserver-Rack", icon: "🖧",
    description: "Ein vollausgestattetes Rack im Zimmer. Du lebst und atmest Code — Fokus ohne Limit.",
    cost: 3500, owned: false, effect: { type: "focusMax", value: 125 },
  },

  // ── Fokus Regeneration ───────────────────────────────────────────────────
  {
    id: "focus-regen-1", groupId: "focus-regen", tier: 1,
    name: "Wasserflasche", icon: "💧",
    description: "Hydration ist alles. Fokus regeneriert sich etwas schneller.",
    cost: 60, owned: false, effect: { type: "focusRegen", value: 1 },
  },
  {
    id: "focus-regen-2", groupId: "focus-regen", tier: 2,
    name: "Energy Drinks", icon: "🥤",
    description: "Eine Kiste Energy Drinks im Regal. Fokus regeneriert sich spürbar schneller.",
    cost: 200, owned: false, effect: { type: "focusRegen", value: 1 },
  },
  {
    id: "focus-regen-3", groupId: "focus-regen", tier: 3,
    name: "Kaffeemaschine", icon: "☕",
    description: "Frischer Kaffee auf Knopfdruck. Fokus kommt doppelt so schnell zurück.",
    cost: 600, owned: false, effect: { type: "focusRegen", value: 2 },
  },
  {
    id: "focus-regen-4", groupId: "focus-regen", tier: 4,
    name: "Power-Nap Liege", icon: "🛋️",
    description: "20 Minuten flach und du bist wieder wie neu. Regeneration auf einem neuen Level.",
    cost: 1400, owned: false, effect: { type: "focusRegen", value: 3 },
  },
  {
    id: "focus-regen-5", groupId: "focus-regen", tier: 5,
    name: "Meditationsecke", icon: "🧘",
    description: "Atemübungen, Stille, Klarheit. Fokus regeneriert sich schneller als du ihn verbrauchst.",
    cost: 3000, owned: false, effect: { type: "focusRegen", value: 4 },
  },

  // ── Wissen pro Klick ─────────────────────────────────────────────────────
  {
    id: "knowledge-1", groupId: "knowledge", tier: 1,
    name: "Zweiter Monitor", icon: "🖥️",
    description: "Docs links, Code rechts. Du lernst mit jedem Klick etwas mehr.",
    cost: 150, owned: false, effect: { type: "knowledgePerClick", value: 1 },
  },
  {
    id: "knowledge-2", groupId: "knowledge", tier: 2,
    name: "Mechanische Tastatur", icon: "⌨️",
    description: "Das Klicken fühlt sich gut an — und irgendwie lernst du dabei schneller.",
    cost: 400, owned: false, effect: { type: "knowledgePerClick", value: 1 },
  },
  {
    id: "knowledge-3", groupId: "knowledge", tier: 3,
    name: "Glasfaser Internet", icon: "📡",
    description: "Tutorials laden sofort, Dokumentationen öffnen in Millisekunden. Wissen fließt.",
    cost: 900, owned: false, effect: { type: "knowledgePerClick", value: 2 },
  },
  {
    id: "knowledge-4", groupId: "knowledge", tier: 4,
    name: "Technische Fachbücher", icon: "📚",
    description: "Ein Regal voller Bücher. Du schlägst nach, verstehst mehr, lernst schneller.",
    cost: 2000, owned: false, effect: { type: "knowledgePerClick", value: 2 },
  },
  {
    id: "knowledge-5", groupId: "knowledge", tier: 5,
    name: "Privater Mentor", icon: "🧑‍💻",
    description: "Ein erfahrener Senior-Dev erklärt dir alles on-demand. Jeder Klick bringt doppelt so viel.",
    cost: 4500, owned: false, effect: { type: "knowledgePerClick", value: 3 },
  },

  // ════════════════════════════════════════════════════════════════════════
  // EPOCHE 2 — AZUBI-ZIMMER
  // ════════════════════════════════════════════════════════════════════════

  // ── Fokus Maximum (Azubi) ────────────────────────────────────────────────
  {
    id: "a-focus-max-1", groupId: "a-focus-max", tier: 1,
    name: "Curved Monitor", icon: "🖥️",
    description: "34 Zoll, gebogen, randlos. Dein Sichtfeld ist jetzt Code — und dein Fokus hält länger.",
    cost: 500, owned: false, effect: { type: "focusMax", value: 30 }, epoch: 2,
  },
  {
    id: "a-focus-max-2", groupId: "a-focus-max", tier: 2,
    name: "Ergonomisches Setup", icon: "🪑",
    description: "Stuhl, Tisch und Monitorarm perfekt eingestellt. Acht Stunden fühlen sich an wie vier.",
    cost: 1200, owned: false, effect: { type: "focusMax", value: 50 }, epoch: 2,
  },
  {
    id: "a-focus-max-3", groupId: "a-focus-max", tier: 3,
    name: "Workstation-PC", icon: "⚙️",
    description: "Kein Lüfterrauschen, keine Wartezeiten. Builds in Sekunden — dein Flow reißt nie ab.",
    cost: 2500, owned: false, effect: { type: "focusMax", value: 75 }, epoch: 2,
  },
  {
    id: "a-focus-max-4", groupId: "a-focus-max", tier: 4,
    name: "Eigenes Azubi-Büro", icon: "🚪",
    description: "Der Chef gibt dir ein eigenes kleines Büro. Tür zu, Kopf frei, Fokus ohne Ende.",
    cost: 5000, owned: false, effect: { type: "focusMax", value: 100 }, epoch: 2,
  },
  {
    id: "a-focus-max-5", groupId: "a-focus-max", tier: 5,
    name: "Deep-Work Studio", icon: "🎛️",
    description: "Schallisoliert, perfekt beleuchtet, alles automatisiert. Ein Raum, gebaut für einen einzigen Zweck.",
    cost: 9000, owned: false, effect: { type: "focusMax", value: 150 }, epoch: 2,
  },

  // ── Fokus Regeneration (Azubi) ───────────────────────────────────────────
  {
    id: "a-focus-regen-1", groupId: "a-focus-regen", tier: 1,
    name: "Espressomaschine", icon: "☕",
    description: "Echter Siebträger statt Bürokaffee. Die Pausen werden kürzer, die Energie größer.",
    cost: 400, owned: false, effect: { type: "focusRegen", value: 1 }, epoch: 2,
  },
  {
    id: "a-focus-regen-2", groupId: "a-focus-regen", tier: 2,
    name: "Meal-Prep Sonntag", icon: "🥗",
    description: "Gesundes Essen statt Imbissbude. Dein Körper dankt es dir mit konstanter Energie.",
    cost: 1000, owned: false, effect: { type: "focusRegen", value: 2 }, epoch: 2,
  },
  {
    id: "a-focus-regen-3", groupId: "a-focus-regen", tier: 3,
    name: "Fitness-Routine", icon: "🏋️",
    description: "Dreimal die Woche Sport. Klingt nach weniger Zeit zum Coden — bringt aber doppelte Regeneration.",
    cost: 2200, owned: false, effect: { type: "focusRegen", value: 2 }, epoch: 2,
  },
  {
    id: "a-focus-regen-4", groupId: "a-focus-regen", tier: 4,
    name: "Fester Schlafrhythmus", icon: "😴",
    description: "23 Uhr Bildschirm aus, 7 Uhr auf. Revolutionär einfach, brutal effektiv.",
    cost: 4500, owned: false, effect: { type: "focusRegen", value: 3 }, epoch: 2,
  },
  {
    id: "a-focus-regen-5", groupId: "a-focus-regen", tier: 5,
    name: "Work-Life-Balance", icon: "⚖️",
    description: "Du hast es wirklich geschafft: Hobbys, Freunde UND Code. Dein Fokus regeneriert wie nie zuvor.",
    cost: 8000, owned: false, effect: { type: "focusRegen", value: 4 }, epoch: 2,
  },

  // ── Wissen pro Klick (Azubi) ─────────────────────────────────────────────
  {
    id: "a-knowledge-1", groupId: "a-knowledge", tier: 1,
    name: "Conference-Tickets", icon: "🎤",
    description: "Deine erste Entwickler-Konferenz. Drei Tage Talks, Workshops und Kontakte — Wissen im Akkord.",
    cost: 600, owned: false, effect: { type: "knowledgePerClick", value: 2 }, epoch: 2,
  },
  {
    id: "a-knowledge-2", groupId: "a-knowledge", tier: 2,
    name: "Pair-Programming", icon: "👥",
    description: "Jeden Freitag zwei Stunden mit dem Senior pairen. Du lernst Dinge, die in keinem Tutorial stehen.",
    cost: 1500, owned: false, effect: { type: "knowledgePerClick", value: 2 }, epoch: 2,
  },
  {
    id: "a-knowledge-3", groupId: "a-knowledge", tier: 3,
    name: "Video-Kurs Bibliothek", icon: "🎓",
    description: "Zugang zu allen Premium-Kursen der großen Plattformen. Jede Pause wird zur Lernsession.",
    cost: 3000, owned: false, effect: { type: "knowledgePerClick", value: 3 }, epoch: 2,
  },
  {
    id: "a-knowledge-4", groupId: "a-knowledge", tier: 4,
    name: "Tech-Meetup Host", icon: "📣",
    description: "Du organisierst das lokale Dev-Meetup. Wer lehrt, lernt doppelt — jeder Klick bringt mehr.",
    cost: 6000, owned: false, effect: { type: "knowledgePerClick", value: 4 }, epoch: 2,
  },
  {
    id: "a-knowledge-5", groupId: "a-knowledge", tier: 5,
    name: "Senior-Mentoring", icon: "🧠",
    description: "Die CTO der Agentur nimmt dich unter ihre Fittiche. Architektur, Karriere, Mindset — alles auf einmal.",
    cost: 12000, owned: false, effect: { type: "knowledgePerClick", value: 5 }, epoch: 2,
  },
];
