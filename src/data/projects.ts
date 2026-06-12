import type { Project } from "../types/project";

export const projects: Project[] = [
  // ── Tier 1: HTML Basics (1–10) ───────────────────────────────────────────
  {
    id: "personal-homepage",
    name: "Persönliche Homepage",
    description: "Ein alter Schulfreund fragt dich, ob du ihm eine kleine persönliche Website baust. Dein erster richtiger Auftrag — du öffnest den Editor und tippst die erste Zeile HTML.",
    requirements: [{ skillId: "html", requiredLevel: 5 }],
    rewards: { knowledge: 0, experience: 20 },
    completed: false,
  },
  {
    id: "birthday-card",
    name: "Digitale Geburtstagskarte",
    description: "Deine Mutter möchte eine digitale Geburtstagskarte für Oma verschicken. Du baust eine schlichte HTML-Seite mit einem netten Spruch und einem Foto. Klein, aber herzlich.",
    requirements: [{ skillId: "html", requiredLevel: 8 }],
    rewards: { knowledge: 0, experience: 25 },
    completed: false,
  },
  {
    id: "school-project",
    name: "Schulprojekt Website",
    description: "Dein Lehrer will, dass alle Schüler ihr Referat als Website abgeben. Du bist natürlich der Einzige, der wirklich HTML schreiben kann — und machst die beste Abgabe der Klasse.",
    requirements: [{ skillId: "html", requiredLevel: 10 }],
    rewards: { knowledge: 0, experience: 30 },
    completed: false,
  },

  // ── Tier 2: HTML + CSS Basics (10–25) ────────────────────────────────────
  {
    id: "firefighter-club",
    name: "Feuerwehr Vereinsseite",
    description: "Die freiwillige Feuerwehr aus dem Nachbarort braucht dringend eine neue Website. Kein Budget, aber viel Dankbarkeit — und deine erste Erfahrung mit echten Kunden.",
    requirements: [
      { skillId: "html", requiredLevel: 15 },
      { skillId: "css", requiredLevel: 10 },
    ],
    rewards: { knowledge: 0, experience: 40 },
    completed: false,
  },
  {
    id: "pet-blog",
    name: "Haustier Blog",
    description: "Eine Nachbarin möchte einen Blog über ihre drei Katzen. Du gestaltest eine bunte, einfache Seite mit Fotos und kurzen Texten. Deine erste Begegnung mit echtem Kundenfeedback.",
    requirements: [
      { skillId: "html", requiredLevel: 12 },
      { skillId: "css", requiredLevel: 8 },
    ],
    rewards: { knowledge: 0, experience: 35 },
    completed: false,
  },
  {
    id: "local-bakery",
    name: "Bäckerei Webseite",
    description: "Die Bäckerei um die Ecke will endlich online sein. Eine Seite mit Öffnungszeiten, Produktfotos und Adresse. Dein erstes echtes Geschäftsprojekt — mit Kaffee und frischen Brötchen als Bezahlung.",
    requirements: [
      { skillId: "html", requiredLevel: 18 },
      { skillId: "css", requiredLevel: 12 },
    ],
    rewards: { knowledge: 0, experience: 45 },
    completed: false,
  },
  {
    id: "gaming-fanpage",
    name: "Gaming Fanpage",
    description: "Dein Lieblingsspiel hat eine riesige Community, aber keine ordentliche Fansite. Du nimmst die Sache selbst in die Hand — mit Custom-Design, Charaktergalerie und News-Bereich.",
    requirements: [
      { skillId: "html", requiredLevel: 22 },
      { skillId: "css", requiredLevel: 18 },
    ],
    rewards: { knowledge: 0, experience: 55 },
    completed: false,
  },

  // ── Tier 3: HTML + CSS Intermediate (25–50) ──────────────────────────────
  {
    id: "sports-club",
    name: "Sportverein Website",
    description: "Der lokale Fußballverein braucht eine moderne Website mit Mannschaftsfotos, Spielplan und Kontaktformular. Dein erstes Projekt mit mehreren Unterseiten.",
    requirements: [
      { skillId: "html", requiredLevel: 28 },
      { skillId: "css", requiredLevel: 25 },
    ],
    rewards: { knowledge: 0, experience: 65 },
    completed: false,
  },
  {
    id: "restaurant-menu",
    name: "Restaurant Speisekarte",
    description: "Ein italienisches Restaurant möchte seine Speisekarte digitalisieren. Schöne Typografie, warme Farben, appetitliche Darstellung. Du lernst, dass Design echte Arbeit ist.",
    requirements: [
      { skillId: "html", requiredLevel: 30 },
      { skillId: "css", requiredLevel: 28 },
    ],
    rewards: { knowledge: 0, experience: 70 },
    completed: false,
  },
  {
    id: "music-band",
    name: "Band Website",
    description: "Eine lokale Indie-Band sucht jemanden, der ihre Website neu gestaltet. Dunkles Design, große Fotos, Konzertdaten. Du hörst ihre Musik beim Coden und bist überraschend begeistert.",
    requirements: [
      { skillId: "html", requiredLevel: 35 },
      { skillId: "css", requiredLevel: 32 },
    ],
    rewards: { knowledge: 0, experience: 80 },
    completed: false,
  },
  {
    id: "photographer-gallery",
    name: "Fotograf Portfolio",
    description: "Ein Fotograf braucht eine elegante Galerie-Website für seine Landschaftsaufnahmen. Vollbild-Bilder, sanfte Übergänge, viel Weißraum. Dein schönstes Projekt bisher.",
    requirements: [
      { skillId: "html", requiredLevel: 38 },
      { skillId: "css", requiredLevel: 35 },
    ],
    rewards: { knowledge: 0, experience: 85 },
    completed: false,
  },
  {
    id: "portfolio",
    name: "Eigenes Portfolio",
    description: "Es wird Zeit, deine Arbeit der Welt zu zeigen. Du baust dein eigenes Portfolio — sauber strukturiert, responsiv, mit einem Design das zeigt: Dieser Entwickler versteht sein Handwerk.",
    requirements: [
      { skillId: "html", requiredLevel: 45 },
      { skillId: "css", requiredLevel: 42 },
    ],
    rewards: { knowledge: 0, experience: 95 },
    completed: false,
  },

  // ── Tier 4: HTML + CSS Advanced (50–75) ──────────────────────────────────
  {
    id: "fashion-blog",
    name: "Fashion Blog",
    description: "Eine Influencerin braucht einen professionellen Blog mit eigenem Branding. Grid-Layout, Custom-Fonts, Newsletter-Formular. Du lernst, was Kunden wirklich meinen wenn sie sagen 'mach es einfach schön'.",
    requirements: [
      { skillId: "html", requiredLevel: 52 },
      { skillId: "css", requiredLevel: 50 },
    ],
    rewards: { knowledge: 0, experience: 105 },
    completed: false,
  },
  {
    id: "event-landing",
    name: "Event Landing Page",
    description: "Ein lokales Tech-Event braucht eine Landing Page die Tickets verkauft. Countdown-Timer, Speaker-Grid, FAQ-Sektion. Deine erste Seite mit echtem Conversion-Ziel.",
    requirements: [
      { skillId: "html", requiredLevel: 55 },
      { skillId: "css", requiredLevel: 55 },
    ],
    rewards: { knowledge: 0, experience: 115 },
    completed: false,
  },
  {
    id: "real-estate",
    name: "Immobilien Webseite",
    description: "Ein Makler möchte seine Objekte professionell präsentieren. Filterbare Karten, Grundrisse, Kontaktformulare pro Objekt. Dein bisher komplexestes Layout-Projekt.",
    requirements: [
      { skillId: "html", requiredLevel: 60 },
      { skillId: "css", requiredLevel: 58 },
    ],
    rewards: { knowledge: 0, experience: 125 },
    completed: false,
  },
  {
    id: "nonprofit-website",
    name: "NGO Website",
    description: "Eine gemeinnützige Organisation braucht eine Website die Spenden sammelt. Emotionale Bilder, klare Calls-to-Action, Vertrauenselemente. Du arbeitest kostenlos — aber es fühlt sich gut an.",
    requirements: [
      { skillId: "html", requiredLevel: 62 },
      { skillId: "css", requiredLevel: 60 },
    ],
    rewards: { knowledge: 0, experience: 120 },
    completed: false,
  },

  // ── Tier 5: HTML + CSS + JS Basics (50–75) ───────────────────────────────
  {
    id: "quiz-game",
    name: "Browser Quiz Spiel",
    description: "Du baust ein kleines Quiz-Spiel für den Browser. Fragen, Antworten, Punkte — alles im Browser ohne Server. Dein erstes richtiges JavaScript-Projekt und du merkst: das macht Spaß.",
    requirements: [
      { skillId: "html", requiredLevel: 55 },
      { skillId: "css", requiredLevel: 45 },
      { skillId: "javascript", requiredLevel: 20 },
    ],
    rewards: { knowledge: 0, experience: 110 },
    completed: false,
  },
  {
    id: "todo-app",
    name: "To-Do App",
    description: "Jeder Entwickler baut irgendwann eine To-Do App. Aufgaben hinzufügen, abhaken, löschen — mit localStorage damit sie nach dem Reload noch da sind. Ein Klassiker aus gutem Grund.",
    requirements: [
      { skillId: "html", requiredLevel: 58 },
      { skillId: "css", requiredLevel: 50 },
      { skillId: "javascript", requiredLevel: 30 },
    ],
    rewards: { knowledge: 0, experience: 120 },
    completed: false,
  },
  {
    id: "weather-widget",
    name: "Wetter Widget",
    description: "Ein Widget das das aktuelle Wetter anzeigt. Dein erstes Mal mit einer externen API — du sendest eine Anfrage, bekommst JSON zurück und renderst die Daten. Die Welt öffnet sich.",
    requirements: [
      { skillId: "html", requiredLevel: 60 },
      { skillId: "css", requiredLevel: 55 },
      { skillId: "javascript", requiredLevel: 35 },
    ],
    rewards: { knowledge: 0, experience: 130 },
    completed: false,
  },
  {
    id: "interactive-site",
    name: "Interaktive Landing Page",
    description: "Ein Startup will eine Landing Page mit Live-Animationen, dynamischem Formular und Dark-Mode-Toggle. JavaScript übernimmt die Kontrolle — und du spürst die Kraft.",
    requirements: [
      { skillId: "html", requiredLevel: 65 },
      { skillId: "css", requiredLevel: 62 },
      { skillId: "javascript", requiredLevel: 40 },
    ],
    rewards: { knowledge: 0, experience: 140 },
    completed: false,
  },

  // ── Tier 6: HTML + CSS + JS Advanced (75–100) ────────────────────────────
  {
    id: "calculator",
    name: "Wissenschaftlicher Taschenrechner",
    description: "Nicht nur Plus und Minus — sin, cos, tan, Klammern, Operatorvorrang. Du baust einen vollständigen Taschenrechner im Browser. Mathematik trifft auf sauberen JavaScript-Code.",
    requirements: [
      { skillId: "html", requiredLevel: 70 },
      { skillId: "css", requiredLevel: 65 },
      { skillId: "javascript", requiredLevel: 55 },
    ],
    rewards: { knowledge: 0, experience: 155 },
    completed: false,
  },
  {
    id: "music-player",
    name: "Browser Music Player",
    description: "Ein vollständiger Musik-Player im Browser. Play, Pause, Skip, Fortschrittsbalken, Lautstärke, Playlist. Die Web Audio API ist dein neuer bester Freund.",
    requirements: [
      { skillId: "html", requiredLevel: 75 },
      { skillId: "css", requiredLevel: 70 },
      { skillId: "javascript", requiredLevel: 60 },
    ],
    rewards: { knowledge: 0, experience: 165 },
    completed: false,
  },
  {
    id: "kanban-board",
    name: "Kanban Board",
    description: "Drag & Drop, mehrere Spalten, Karten erstellen und verschieben — ein vollständiges Kanban-Board nur mit Vanilla JS. Dein technisch anspruchsvollstes Projekt bisher.",
    requirements: [
      { skillId: "html", requiredLevel: 80 },
      { skillId: "css", requiredLevel: 75 },
      { skillId: "javascript", requiredLevel: 70 },
    ],
    rewards: { knowledge: 0, experience: 180 },
    completed: false,
  },
  {
    id: "chat-ui",
    name: "Chat Interface",
    description: "Ein Startup braucht ein Chat-UI Prototype. Echtzeitartige Nachrichten-Darstellung, Emoji-Picker, Typing-Indicator, responsives Layout. Kein Backend — aber es sieht täuschend echt aus.",
    requirements: [
      { skillId: "html", requiredLevel: 85 },
      { skillId: "css", requiredLevel: 82 },
      { skillId: "javascript", requiredLevel: 78 },
    ],
    rewards: { knowledge: 0, experience: 195 },
    completed: false,
  },
  {
    id: "data-dashboard",
    name: "Analytics Dashboard",
    description: "Ein kleines Unternehmen will seine Verkaufsdaten visualisieren. Charts, Tabellen, Filter, Export-Funktion — alles im Browser mit echten Daten aus einer JSON-Datei. Dein erstes professionelles Tool.",
    requirements: [
      { skillId: "html", requiredLevel: 88 },
      { skillId: "css", requiredLevel: 85 },
      { skillId: "javascript", requiredLevel: 85 },
    ],
    rewards: { knowledge: 0, experience: 210 },
    completed: false,
  },

  // ── Graduation ────────────────────────────────────────────────────────────
  {
    id: "graduation-project",
    name: "Abschlussprojekt: NuVio OS v0.1",
    description: "Du sitzt allein im Kinderzimmer. Draußen ist es längst dunkel. Auf dem Monitor flimmert der Code deines bisher größten Projekts — ein vollständiges Mini-Betriebssystem als Web-App. HTML, CSS, JavaScript. Alles auf Maximum. Wenn das läuft, bist du bereit für das Azubi-Zimmer.",
    requirements: [
      { skillId: "html", requiredLevel: 100 },
      { skillId: "css", requiredLevel: 100 },
      { skillId: "javascript", requiredLevel: 100 },
    ],
    rewards: { knowledge: 0, experience: 500 },
    completed: false,
    isGraduation: true,
    durationSeconds: 90,
  },

  // ════════════════════════════════════════════════════════════════════════
  // EPOCHE 2 — AZUBI-ZIMMER (Ausbildung bei der Agentur "PixelWerk")
  // ════════════════════════════════════════════════════════════════════════

  // ── Tier 1: Git Basics ─────────────────────────────────────────────────
  {
    id: "first-commit",
    name: "Der erste Commit",
    description: "Erster Tag in der Agentur PixelWerk. Dein Ausbilder zeigt dir das Team-Repository und nickt dir zu. Du tippst mit leicht zitternden Fingern: git commit -m 'mein erster commit'. Willkommen im echten Entwicklerleben.",
    requirements: [{ skillId: "git", requiredLevel: 5 }],
    rewards: { knowledge: 0, experience: 150 },
    completed: false,
    epoch: 2,
  },
  {
    id: "branch-chaos",
    name: "Branch-Chaos aufräumen",
    description: "Ein ehemaliger Praktikant hat 14 verwaiste Branches hinterlassen — mit Namen wie 'test2-final-NEU'. Dein Ausbilder grinst: 'Räum das mal auf.' Du lernst rebase, merge und das gute Gefühl eines sauberen Repos.",
    requirements: [{ skillId: "git", requiredLevel: 10 }],
    rewards: { knowledge: 0, experience: 170 },
    completed: false,
    epoch: 2,
  },
  {
    id: "merge-konflikt",
    name: "Der Merge-Konflikt",
    description: "Du und der andere Azubi habt dieselbe Datei bearbeitet. Git meldet: CONFLICT. Panik? Nein — du löst deinen ersten echten Merge-Konflikt und fühlst dich danach unbesiegbar.",
    requirements: [{ skillId: "git", requiredLevel: 15 }],
    rewards: { knowledge: 0, experience: 190 },
    completed: false,
    epoch: 2,
  },

  // ── Tier 2: Erste React-Schritte ───────────────────────────────────────
  {
    id: "komponenten-baukasten",
    name: "Komponenten-Baukasten",
    description: "Deine erste React-Aufgabe: eine Button-Bibliothek für das Team. Primary, Secondary, Danger — alles als wiederverwendbare Komponenten. Plötzlich ergibt das Komponenten-Denken Sinn.",
    requirements: [
      { skillId: "git", requiredLevel: 18 },
      { skillId: "react", requiredLevel: 10 },
    ],
    rewards: { knowledge: 0, experience: 210 },
    completed: false,
    epoch: 2,
  },
  {
    id: "todo-react",
    name: "To-Do App — diesmal in React",
    description: "Dieselbe App wie damals im Kinderzimmer — aber jetzt mit useState, Props und Komponenten. Du vergleichst den alten Vanilla-JS-Code mit dem neuen und musst lachen: Wie weit du gekommen bist.",
    requirements: [
      { skillId: "git", requiredLevel: 20 },
      { skillId: "react", requiredLevel: 15 },
    ],
    rewards: { knowledge: 0, experience: 225 },
    completed: false,
    epoch: 2,
  },
  {
    id: "kunden-landingpage",
    name: "Kunden-Landingpage",
    description: "Dein erstes echtes Kundenprojekt bei PixelWerk: eine Landingpage für ein Fitnessstudio — in React, versteht sich. Der Kunde will 'mehr Dynamik'. Du lieferst.",
    requirements: [
      { skillId: "git", requiredLevel: 25 },
      { skillId: "react", requiredLevel: 20 },
    ],
    rewards: { knowledge: 0, experience: 240 },
    completed: false,
    epoch: 2,
  },

  // ── Tier 3: TypeScript kommt dazu ──────────────────────────────────────
  {
    id: "props-typisieren",
    name: "Props endlich typisiert",
    description: "Der Senior-Dev sieht deine Komponenten und sagt nur: 'Schön. Jetzt mit Typen.' Du schreibst dein erstes interface Props — und der Editor fängt plötzlich deine Fehler, bevor du sie machst.",
    requirements: [
      { skillId: "react", requiredLevel: 25 },
      { skillId: "typescript", requiredLevel: 10 },
    ],
    rewards: { knowledge: 0, experience: 255 },
    completed: false,
    epoch: 2,
  },
  {
    id: "form-wizard",
    name: "Formular-Wizard",
    description: "Ein mehrstufiges Anmeldeformular mit Validierung für einen Versicherungskunden. Schritt für Schritt, State über mehrere Seiten, alles typisiert. Trocken? Vielleicht. Lehrreich? Definitiv.",
    requirements: [
      { skillId: "git", requiredLevel: 30 },
      { skillId: "react", requiredLevel: 30 },
      { skillId: "typescript", requiredLevel: 15 },
    ],
    rewards: { knowledge: 0, experience: 270 },
    completed: false,
    epoch: 2,
  },
  {
    id: "api-anbindung",
    name: "API-Anbindung",
    description: "Du verbindest zum ersten Mal ein React-Frontend mit einer echten REST-API — inklusive sauber typisierter Antworten. Als die Daten live im UI auftauchen, grinst du den ganzen Tag.",
    requirements: [
      { skillId: "react", requiredLevel: 35 },
      { skillId: "typescript", requiredLevel: 20 },
    ],
    rewards: { knowledge: 0, experience: 285 },
    completed: false,
    epoch: 2,
  },
  {
    id: "dashboard-widgets",
    name: "Dashboard-Widgets",
    description: "Ein Kunde will sein Verwaltungs-Dashboard modernisieren: Widgets, die sich per Drag & Drop anordnen lassen. Du baust ein flexibles Grid-System — und lernst, wie viel Arbeit in 'einfach verschiebbar' steckt.",
    requirements: [
      { skillId: "git", requiredLevel: 35 },
      { skillId: "react", requiredLevel: 40 },
      { skillId: "typescript", requiredLevel: 25 },
    ],
    rewards: { knowledge: 0, experience: 300 },
    completed: false,
    epoch: 2,
  },

  // ── Tier 4: Mittendrin im Agentur-Alltag ───────────────────────────────
  {
    id: "code-review",
    name: "Dein erstes Code-Review",
    description: "Der Senior reviewed deinen Pull Request — 23 Kommentare. Autsch. Eine Woche später reviewst du seinen Code und findest einen echten Bug. Er kauft dir einen Kaffee. Du bist angekommen.",
    requirements: [
      { skillId: "git", requiredLevel: 45 },
      { skillId: "typescript", requiredLevel: 30 },
    ],
    rewards: { knowledge: 0, experience: 315 },
    completed: false,
    epoch: 2,
  },
  {
    id: "design-system",
    name: "Design-System der Agentur",
    description: "PixelWerk braucht ein einheitliches Design-System für alle Kundenprojekte. Du bekommst die Aufgabe: Farben, Typografie, Komponenten — alles dokumentiert und typisiert. Dein Name steht im Footer der Doku.",
    requirements: [
      { skillId: "react", requiredLevel: 50 },
      { skillId: "typescript", requiredLevel: 40 },
    ],
    rewards: { knowledge: 0, experience: 335 },
    completed: false,
    epoch: 2,
  },
  {
    id: "refactoring-sprint",
    name: "Refactoring-Sprint",
    description: "Ein uraltes jQuery-Projekt eines Bestandskunden soll nach React migriert werden. Zwei Wochen Sprint, tausende Zeilen Legacy-Code. Du tauchst ab — und tauchst mit einer modernen Codebasis wieder auf.",
    requirements: [
      { skillId: "git", requiredLevel: 50 },
      { skillId: "react", requiredLevel: 55 },
      { skillId: "typescript", requiredLevel: 45 },
    ],
    rewards: { knowledge: 0, experience: 350 },
    completed: false,
    epoch: 2,
  },
  {
    id: "state-management",
    name: "State-Management Migration",
    description: "Das größte Kundenprojekt der Agentur versinkt im Props-Drilling-Chaos. Du schlägst einen zentralen Store vor — und darfst die Migration leiten. Der Code wird halb so lang und doppelt so klar.",
    requirements: [
      { skillId: "react", requiredLevel: 60 },
      { skillId: "typescript", requiredLevel: 50 },
    ],
    rewards: { knowledge: 0, experience: 370 },
    completed: false,
    epoch: 2,
  },

  // ── Tier 5: Fortgeschritten ────────────────────────────────────────────
  {
    id: "release-pipeline",
    name: "Release-Pipeline",
    description: "Releases bei PixelWerk liefen bisher per Hand — und gingen regelmäßig schief. Du baust eine saubere Pipeline mit Tags, Release-Branches und automatischen Checks. Der Chef ist beeindruckt.",
    requirements: [
      { skillId: "git", requiredLevel: 65 },
      { skillId: "typescript", requiredLevel: 55 },
    ],
    rewards: { knowledge: 0, experience: 390 },
    completed: false,
    epoch: 2,
  },
  {
    id: "kundenportal",
    name: "Kundenportal",
    description: "Ein komplettes Self-Service-Portal: Login, Dokumente, Rechnungen, Support-Tickets. Das bisher größte Projekt deiner Ausbildung — und du baust tragende Teile davon selbst.",
    requirements: [
      { skillId: "git", requiredLevel: 70 },
      { skillId: "react", requiredLevel: 70 },
      { skillId: "typescript", requiredLevel: 65 },
    ],
    rewards: { knowledge: 0, experience: 410 },
    completed: false,
    epoch: 2,
  },
  {
    id: "performance-audit",
    name: "Performance-Audit",
    description: "Die App eines Großkunden lädt 8 Sekunden. Inakzeptabel. Du analysierst Bundles, lazy-loadest Routen, memoisierst Komponenten — am Ende sind es 1,2 Sekunden. Der Kunde verlängert den Vertrag.",
    requirements: [
      { skillId: "react", requiredLevel: 80 },
      { skillId: "typescript", requiredLevel: 75 },
    ],
    rewards: { knowledge: 0, experience: 430 },
    completed: false,
    epoch: 2,
  },

  // ── Tier 6: Kurz vor der Prüfung ───────────────────────────────────────
  {
    id: "open-source",
    name: "Open-Source Beitrag",
    description: "Du findest einen Bug in einer Library, die ihr täglich nutzt. Statt zu meckern, fixst du ihn — und stellst deinen ersten Pull Request an ein echtes Open-Source-Projekt. Merged. Dein Name im Changelog.",
    requirements: [
      { skillId: "git", requiredLevel: 90 },
      { skillId: "react", requiredLevel: 85 },
      { skillId: "typescript", requiredLevel: 80 },
    ],
    rewards: { knowledge: 0, experience: 450 },
    completed: false,
    epoch: 2,
  },
  {
    id: "projekt-lead",
    name: "Projekt-Lead: Agentur-Website",
    description: "PixelWerk relauncht die eigene Website — und dein Ausbilder sagt: 'Mach du das. Komplett.' Planung, Architektur, Umsetzung, Review. Dein erstes Projekt als Lead. Es wird das beste der Agentur.",
    requirements: [
      { skillId: "git", requiredLevel: 95 },
      { skillId: "react", requiredLevel: 95 },
      { skillId: "typescript", requiredLevel: 90 },
    ],
    rewards: { knowledge: 0, experience: 480 },
    completed: false,
    epoch: 2,
  },

  // ── Graduation Epoche 2 ────────────────────────────────────────────────
  {
    id: "graduation-azubi",
    name: "Abschlussprüfung: NuVio OS v0.2",
    description: "Der Prüfungstag. Dein Meisterstück: NuVio OS — das Projekt aus dem Kinderzimmer, komplett neu gebaut mit React und TypeScript. Sauber versioniert, getestet, dokumentiert. Die Prüfer nicken anerkennend. Wenn das läuft, bist du ausgelernt — und bereit für die Selbstständigkeit.",
    requirements: [
      { skillId: "git", requiredLevel: 100 },
      { skillId: "react", requiredLevel: 100 },
      { skillId: "typescript", requiredLevel: 100 },
    ],
    rewards: { knowledge: 0, experience: 1000 },
    completed: false,
    isGraduation: true,
    durationSeconds: 120,
    epoch: 2,
  },
];
