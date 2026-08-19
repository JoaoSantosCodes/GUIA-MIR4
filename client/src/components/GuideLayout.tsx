import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, X, LogIn, Swords, BookOpen, Pickaxe, User as UserIcon, Coins, Home, Star, Skull, Trophy, TrendingUp, Moon, Sun, Castle, Gem, Calendar, Calculator, Layers, Package, Newspaper } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import EventNotificationsBell from "@/components/EventNotificationsBell";
import LiveEventBanner from "@/components/LiveEventBanner";
import { CODEX_ITEMS, CLASSES, CURRENCIES, ECONOMY_TIPS, FARM_SPOTS, LEVELING_GUIDE, MAGIC_SQUARE_CHAMBERS, RAIDS, SPIRITS, TIER_SCENARIOS, SABUK_CONTENT, MYSTERIES, SEAL_GUIDE, GAME_EVENTS, CLASS_SKILLS, MINE_AREAS, EQUIPMENT_TYPES, GRADE_INFO, MATERIALS, ENHANCE_COSTS } from "@shared/guideData";
import { cn } from "@/lib/utils";

export interface SearchHit {
  id: string;
  type: string;
  title: string;
  section: string;
  sectionLabel: string;
  path: string;
}

export const GUIDE_SECTIONS = [
  { key: "espiritos", label: "Espíritos", path: "/espiritos" },
  { key: "codex", label: "Codex", path: "/codex" },
  { key: "farm", label: "Locais de Farm", path: "/farm" },
  { key: "classes", label: "Classes", path: "/classes" },
  { key: "economia", label: "Economia", path: "/economia" },
  { key: "raids", label: "Raids e Bosses", path: "/raids" },
  { key: "tier-list", label: "Tier List", path: "/tier-list" },
  { key: "nivel", label: "Leveling", path: "/nivel" },
  { key: "sabuk", label: "Sabuk", path: "/sabuk" },
  { key: "misterios", label: "Mistérios", path: "/misterios" },
  { key: "selos", label: "Selos", path: "/selos" },
  { key: "calendario", label: "Calendário", path: "/calendario" },
  { key: "calculadora", label: "Calculadora", path: "/calculadora" },
  { key: "subclasses", label: "Subclasses", path: "/subclasses" },
  { key: "equipamentos", label: "Equipamentos", path: "/equipamentos" },
  { key: "materiais", label: "Materiais", path: "/materiais" },
  { key: "faq", label: "FAQ", path: "/faq" },
  { key: "placar", label: "Placar", path: "/placar" },
  { key: "novidades", label: "Notícias", path: "/novidades" },
  { key: "perfil", label: "Meu Perfil", path: "/perfil" },
];

const BUILD_SEARCH_INDEX = (): SearchHit[] => {
  const hits: SearchHit[] = [
    { id: "home", type: "home", title: "Visão geral do jogo e sistemas principais", section: "home", sectionLabel: "Início", path: "/" },
  ];
  SPIRITS.forEach(s =>
    hits.push({
      id: `spirit-${s.key}`,
      type: "spirit",
      title: `${s.name} — ${s.title} (${s.rarity}) · ${[s.effects.join(", "), s.passive, s.tip, s.obtain].filter(Boolean).join(" · ")}`,
      section: "spirit",
      sectionLabel: "Espíritos",
      path: `/espiritos#${s.key}`,
    }),
  );
  CODEX_ITEMS.forEach(c =>
    hits.push({
      id: `codex-${c.key}`,
      type: "codex",
      title: `${c.name} — ${c.category} (${c.rarity} Tier ${c.tier}) · ${c.tip}`,
      section: "codex",
      sectionLabel: "Codex",
      path: `/codex#${c.key}`,
    }),
  );
  FARM_SPOTS.forEach(f =>
    hits.push({
      id: `farm-${f.key}`,
      type: "farm",
      title: `${f.name} — Nível ${f.level}${f.pvp ? " (PvP)" : ""} · ${[f.highlights.join(", "), f.note].join(" · ")}`,
      section: "farm",
      sectionLabel: "Locais de Farm",
      path: `/farm#${f.key}`,
    }),
  );
  CLASSES.forEach(c =>
    hits.push({
      id: `class-${c.key}`,
      type: "class",
      title: `${c.name} — ${c.role} · ${[c.description, c.strategy, c.combos.join(" · "), c.skills.map(s => s.name).join(", "), c.build.map(b => `${b.title}: ${b.desc}`).join(" · ")].join(" · ")}`,
      section: "class",
      sectionLabel: "Classes",
      path: `/classes#${c.key}`,
    }),
  );
  [
    { id: "econ-moedas", title: "Moedas do jogo (Copper, Energy, Darksteel, Gold)", path: "/economia#moedas" },
    { id: "econ-draco", title: "Token DRACO e conversão de Darksteel", path: "/economia#draco" },
    { id: "econ-mercado", title: "Mercado (Market) — venda e compra de itens", path: "/economia#mercado" },
    { id: "econ-dicas", title: "Dicas de acumulação de riqueza", path: "/economia#dicas" },
  ].forEach(e =>
    hits.push({
      id: e.id,
      type: "economy",
      title: e.title,
      section: "economy",
      sectionLabel: "Economia",
      path: e.path,
    }),
  );
  CURRENCIES.forEach(c =>
    hits.push({
      id: `currency-${c.name}`,
      type: "economy",
      title: `${c.name} — ${c.obtain} · ${c.use}`,
      section: "economy",
      sectionLabel: "Economia",
      path: "/economia#moedas",
    }),
  );
  ECONOMY_TIPS.forEach(t =>
    hits.push({
      id: `tip-${t.title}`,
      type: "economy",
      title: `${t.title} — ${t.desc}`,
      section: "economy",
      sectionLabel: "Economia",
      path: "/economia#dicas",
    }),
  );
  TIER_SCENARIOS.forEach(t =>
    hits.push({
      id: `tier-${t.key}`,
      type: "tier",
      title: `Tier List ${t.label} — ${t.description}`,
      section: "tier",
      sectionLabel: "Tier List",
      path: "/tier-list",
    }),
  );
  LEVELING_GUIDE.forEach(b =>
    hits.push({
      id: `nivel-${b.range}`,
      type: "nivel",
      title: `Nível ${b.range}: ${b.title} — ${[...b.goals, ...b.zones.map(z => z.name), ...b.tips].join(" · ")}`,
      section: "nivel",
      sectionLabel: "Leveling",
      path: `/nivel#faixa-${b.range}`,
    }),
  );
  MAGIC_SQUARE_CHAMBERS.forEach(m =>
    hits.push({
      id: `magic-${m.name}`,
      type: "farm",
      title: `${m.name} (${m.chance}) — ${m.purpose}${m.pvp ? " · PvP" : " · sem PvP"}`,
      section: "farm",
      sectionLabel: "Magic Square",
      path: "/farm#magic-square",
    }),
  );
  RAIDS.forEach(r =>
    hits.push({
      id: `raid-${r.key}`,
      type: "raid",
      title: `${r.name} (${r.difficulty}) — ${r.type} · ${r.location} · PS ${r.power} · ${[r.strategy.join(" · "), r.drops.map(d => d.item).join(", ")].join(" · ")}`,
      section: "raid",
      sectionLabel: "Raids e Bosses",
      path: `/raids#${r.key}`,
    }),
  );
  SABUK_CONTENT.forEach(s =>
    hits.push({
      id: `sabuk-${s.key}`,
      type: "sabuk",
      title: `${s.title} — ${[s.description, ...s.details].join(" · ")}`,
      section: "sabuk",
      sectionLabel: "Sabuk & Guildas",
      path: "/sabuk",
    }),
  );
  MYSTERIES.forEach(m =>
    hits.push({
      id: `mystery-${m.key}`,
      type: "mystery",
      title: `${m.name} (${m.location}) — ${m.tip}`,
      section: "mystery",
      sectionLabel: "Mistérios",
      path: `/misterios#${m.key}`,
    }),
  );
  SEAL_GUIDE.forEach(s =>
    hits.push({
      id: `seal-${s.stage}`,
      type: "seal",
      title: `${s.stage} — ${[s.description, s.bonus, ...s.route.map(r => `${r.name}: ${r.detail}`), s.howToUpgrade].join(" · ")}`,
      section: "seal",
      sectionLabel: "Selos & Geminação",
      path: "/selos",
    }),
  );
  MINE_AREAS.forEach(a =>
    hits.push({
      id: `calc-${a.key}`,
      type: "calc",
      title: `Mineração ${a.name} (${a.levelRange}) — ~${a.dsPerHourBase.toLocaleString("pt-BR")} DS/h base · ${a.note}`,
      section: "calc",
      sectionLabel: "Calculadora Darksteel",
      path: "/calculadora",
    }),
  );
  CLASS_SKILLS.forEach(c =>
    hits.push({
      id: `skills-${c.key}`,
      type: "skills",
      title: `${c.name} — builds avançadas · ${[...c.skillsHighlight.map(s => `${s.name}: ${s.desc}`), ...c.builds.map(b => `${b.label}: ${b.focus}`), c.subclassTip].join(" · ")}`,
      section: "skills",
      sectionLabel: "Subclasses & Skills",
      path: `/subclasses#${c.key}`,
    }),
  );
  GAME_EVENTS.forEach(e =>
    hits.push({
      id: `event-${e.key}`,
      type: "event",
      title: `${e.name} — ${[e.schedule, e.duration, e.description, e.tip].join(" · ")}`,
      section: "event",
      sectionLabel: "Calendário de Eventos",
      path: "/calendario",
    }),
  );
  EQUIPMENT_TYPES.forEach(t =>
    hits.push({
      id: `equip-${t.key}`,
      type: "gear",
      title: `${t.slot} (${t.examples.join(", ")}) — ${t.statPerLevel} · ${t.statSecondary}`,
      section: "gear",
      sectionLabel: "Equipamentos & Geminação",
      path: "/equipamentos",
    }),
  );
  GRADE_INFO.forEach(g =>
    hits.push({
      id: `grade-${g.key}`,
      type: "gear",
      title: `${g.name} — ${g.darksteelCraft} · ${g.note}`,
      section: "gear",
      sectionLabel: "Equipamentos & Geminação",
      path: "/equipamentos",
    }),
  );
  MATERIALS.forEach(m =>
    hits.push({
      id: `mat-${m.key}`,
      type: "materials",
      title: `${m.name} — Fontes: ${m.sources.join("; ")} · Usado em: ${m.usedFor.join("; ")}`,
      section: "materials",
      sectionLabel: "Materiais & Crafting",
      path: "/materiais",
    }),
  );
  hits.push({
    id: "faq",
    type: "faq",
    title: "FAQ Comunitária — dicas mais votadas da comunidade de todas as páginas",
    section: "faq",
    sectionLabel: "FAQ Comunitária",
    path: "/faq",
  },
  {
    id: "placar",
    type: "placar",
    title: "Placar da Comunidade — ranking de jogadores com mais medalhas Dica de Ouro",
    section: "placar",
    sectionLabel: "Placar",
    path: "/placar",
  });
  hits.push({
    id: "novidades-cap21",
    type: "news",
    title: "Notícias — Capítulo 21 e 5º Aniversário: nova classe Invocador (Spirit Summoner), Fusão de Servidores, Mundo Impulsionador e eventos de aniversário",
    section: "news",
    sectionLabel: "Notícias",
    path: "/novidades",
  });
  hits.push({
    id: "timeline-capitulos",
    type: "news",
    title: "Linha do Tempo dos 21 Capítulos do MIR4 — de Névoa de Guerra (2021) a Invocador (2026)",
    section: "news",
    sectionLabel: "Notícias",
    path: "/novidades",
  });
  ENHANCE_COSTS.forEach(c =>
    hits.push({
      id: `enhance-${c.stage}`,
      type: "gear",
      title: `Enhance +${c.stage} — ${c.darksteel.toLocaleString("pt-BR")} Darksteel + ${c.copper.toLocaleString("pt-BR")} Copper · ${c.failRisk}`,
      section: "gear",
      sectionLabel: "Equipamentos & Geminação",
      path: "/equipamentos",
    }),
  );
  return hits;
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { user, loading } = useAuth();
  const { theme, toggleTheme, switchable } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const index = useMemo(() => BUILD_SEARCH_INDEX(), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index.filter(h => h.title.toLowerCase().includes(q) || h.sectionLabel.toLowerCase().includes(q)).slice(0, 10);
  }, [query, index]);

  // Keep mobile menu closed on navigation
  useEffect(() => setMobileOpen(false), [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-amber-700/40 bg-[oklch(0.13_0.015_280_/_0.92)] backdrop-blur-md shadow-lg shadow-black/40">
        <div className="container flex items-center gap-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Swords className="h-6 w-6 text-amber-400" />
            <span className="gold-text text-xl font-bold tracking-wide font-sans">GUIA MIR4</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            {GUIDE_SECTIONS.filter(s => s.key !== "perfil").map(s => (
              <Link
                key={s.key}
                href={s.path}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-amber-900/30 hover:text-amber-300",
                  location.startsWith(s.path) && s.path !== "/perfil"
                    ? "text-amber-400 bg-amber-950/40"
                    : "text-slate-300",
                )}
              >
                {s.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearchOpen(true); setQuery(""); }}
              className="gap-2 border-amber-700/50 text-amber-200 hover:bg-amber-900/30 hover:text-amber-100"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar no guia</span>
            </Button>

            {switchable && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-amber-200 hover:bg-amber-900/30" aria-label="Alternar tema">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            {loading ? null : user ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="gap-2 text-amber-200 hover:bg-amber-900/30">
                  <Link href="/perfil"><UserIcon className="h-4 w-4" /><span className="hidden sm:inline">{user.name?.split(" ")[0]}</span></Link>
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => startLogin()} className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100 border border-amber-700/50">
                <LogIn className="h-4 w-4" /> Entrar
              </Button>
            )}

            <EventNotificationsBell />
            <LiveEventBanner />

            <Button variant="ghost" size="icon" className="md:hidden text-amber-200" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-amber-800/40 bg-[oklch(0.13_0.015_280)] px-4 py-2 flex flex-col gap-1">
            {GUIDE_SECTIONS.map(s => (
              <Link
                key={s.key}
                href={s.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.startsWith(s.path) ? "text-amber-400 bg-amber-950/40" : "text-slate-300 hover:bg-amber-900/30",
                )}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="border-t border-amber-800/40 bg-[oklch(0.12_0.01_280)] py-8 mt-12">
        <div className="container flex flex-col items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <a href="https://x.com/playmir4" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="rounded-full border border-slate-700/60 p-2 text-slate-400 transition-colors hover:border-amber-600/60 hover:text-amber-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://discord.gg/wemade" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="rounded-full border border-slate-700/60 p-2 text-slate-400 transition-colors hover:border-amber-600/60 hover:text-amber-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
            </a>
            <a href="https://www.youtube.com/@playmir4" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full border border-slate-700/60 p-2 text-slate-400 transition-colors hover:border-amber-600/60 hover:text-amber-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.instagram.com/playmir4/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-slate-700/60 p-2 text-slate-400 transition-colors hover:border-amber-600/60 hover:text-amber-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <span className="flex items-center gap-2"><Swords className="h-4 w-4 text-amber-600" /> Guia Completo MIR4 — conteúdo independente de fãs</span>
          <span>MIR4 é marca registrada da Wemade Co., Ltd. Este site não é afiliado à desenvolvedora.</span>
        </div>
      </footer>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-[oklch(0.17_0.015_280)] border-amber-700/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="gold-text">Buscar no Guia</DialogTitle>
            <DialogDescription className="text-slate-400">
              Espíritos, itens de Codex, áreas de farm, classes e economia.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
            <Input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ex: Styx, Darksteel, Snake Valley, Lancer..."
              className="pl-9 bg-[oklch(0.2_0.02_280)] border-amber-800/50 text-amber-100 placeholder:text-slate-600"
            />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-1">
            {filtered.length === 0 && query.trim().length >= 2 && (
              <p className="text-sm text-slate-500 py-4 text-center">Nenhum resultado encontrado.</p>
            )}
            {filtered.map(hit => (
              <button
                key={hit.id}
                onClick={() => { setSearchOpen(false); navigate(hit.path); window.location.hash = hit.path.includes("#") ? hit.path.split("#")[1] : ""; }}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-amber-900/30 transition-colors"
              >
                <HitIcon type={hit.type} />
                <span className="flex-1 text-sm text-slate-200">{hit.title}</span>
                <Badge variant="outline" className="border-amber-700/50 text-amber-400 text-xs shrink-0">{hit.sectionLabel}</Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HitIcon({ type }: { type: string }) {
  const cls = "h-4 w-4 text-amber-500 shrink-0";
  switch (type) {
    case "home": return <Home className={cls} />;
    case "spirit": return <Star className={cls} />;
    case "codex": return <BookOpen className={cls} />;
    case "farm": return <Pickaxe className={cls} />;
    case "class": return <Swords className={cls} />;
    case "raid": return <Skull className={cls} />;
    case "tier": return <Trophy className={cls} />;
    case "nivel": return <TrendingUp className={cls} />;
    case "sabuk": return <Castle className={cls} />;
    case "mystery": return <BookOpen className={cls} />;
    case "seal": return <Gem className={cls} />;
    case "event": return <Calendar className={cls} />;
    case "calc": return <Calculator className={cls} />;
    case "skills": return <Layers className={cls} />;
    case "gear": return <Gem className={cls} />;
    case "materials": return <Package className={cls} />;
    case "news": return <Newspaper className={cls} />;
    case "placar": return <Trophy className={cls} />;
    case "faq": return <BookOpen className={cls} />;
    default: return <Coins className={cls} />;
  }
}
