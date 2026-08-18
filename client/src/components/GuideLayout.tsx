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
import { Search, Menu, X, LogIn, Swords, BookOpen, Pickaxe, User as UserIcon, Coins, Home, Star, Skull, Trophy, TrendingUp } from "lucide-react";
import { CODEX_ITEMS, CLASSES, CURRENCIES, ECONOMY_TIPS, FARM_SPOTS, LEVELING_GUIDE, MAGIC_SQUARE_CHAMBERS, RAIDS, SPIRITS, TIER_SCENARIOS } from "@shared/guideData";
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
  return hits;
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { user, loading } = useAuth();
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
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
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
    default: return <Coins className={cls} />;
  }
}
