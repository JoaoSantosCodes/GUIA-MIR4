import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import ScrollToTop from "@/components/ScrollToTop";
import {
  SPIRITS,
  CODEX_ITEMS,
  FARM_SPOTS,
  CLASSES,
  RAIDS,
  SABUK_CONTENT,
  MYSTERIES,
  SEAL_GUIDE,
  CLASS_SKILLS,
  EQUIPMENT_TYPES,
  MATERIALS,
} from "@shared/guideData";
import { Loader2, Star, BookOpen, Pickaxe, Swords, Skull, Castle, Sparkles, Gem, Shield, UserX, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const TYPE_META: Record<string, { label: string; path: string; Icon: typeof Star }> = {
  spirit: { label: "Espíritos", path: "/espiritos", Icon: Star },
  codex: { label: "Codex", path: "/codex", Icon: BookOpen },
  farm: { label: "Locais de Farm", path: "/farm", Icon: Pickaxe },
  class: { label: "Classes", path: "/classes", Icon: Swords },
  economy: { label: "Economia", path: "/economia", Icon: Star },
  raid: { label: "Raids", path: "/raids", Icon: Skull },
  boss: { label: "Raids", path: "/raids", Icon: Skull },
  sabuk: { label: "Sabuk", path: "/sabuk", Icon: Castle },
  mystery: { label: "Mistérios", path: "/misterios", Icon: Sparkles },
  seal: { label: "Selos", path: "/selos", Icon: Gem },
  gear: { label: "Equipamentos", path: "/equipamentos", Icon: Shield },
  materials: { label: "Materiais", path: "/materiais", Icon: Pickaxe },
};

function resolveTitle(type: string, key: string) {
  switch (type) {
    case "spirit": return SPIRITS.find(s => s.key === key)?.name ?? key;
    case "codex": return CODEX_ITEMS.find(c => c.key === key)?.name ?? key;
    case "farm": return FARM_SPOTS.find(f => f.key === key)?.name ?? key;
    case "class": return CLASSES.find(c => c.key === key)?.name ?? key;
    case "sabuk": return key === "torre-conquista" ? "Torre da Conquista" : (SABUK_CONTENT.find(s => s.key === key)?.title ?? key);
    case "mystery": return MYSTERIES.find(m => m.key === key)?.name ?? key;
    case "seal": return SEAL_GUIDE.find(s => s.stage.toLowerCase().replace(/\s/g, "-") === key)?.stage ?? key;
    case "raid":
    case "boss": return RAIDS.find(r => r.key === key)?.name ?? key;
    case "gear": return EQUIPMENT_TYPES.find(e => e.key === key)?.slot ?? key;
    default: return key;
  }
}

export default function SharedProfile() {
  const params = useParams<{ id: string }>();
  const userId = Number(params.id);
  const { data: profile, isLoading, isError } = trpc.share.getProfile.useQuery(
    { userId: Number.isFinite(userId) ? userId : 0 },
    { enabled: Number.isFinite(userId) && userId > 0 },
  );

  useEffect(() => {
    if (profile) document.title = `Guia MIR4 — Favoritos de ${profile.name}`;
  }, [profile]);

  const grouped = (profile?.favorites ?? []).reduce<Record<string, { label: string; path: string; Icon: typeof Star; items: string[] }>>((acc, fav) => {
    const [type, key] = fav.itemId.split(":");
    const meta = TYPE_META[fav.itemType] ?? TYPE_META[type];
    if (!meta) return acc;
    const bucket = acc[fav.itemType] ?? { label: meta.label, path: meta.path, Icon: meta.Icon, items: [] };
    bucket.items.push(resolveTitle(type, key));
    acc[fav.itemType] = bucket;
    return acc;
  }, {});

  return (
    <>
      <ScrollToTop />
      <div className="container py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-500/80">Perfil público compartilhado</p>
            <h1 className="gold-text mt-1 text-3xl font-bold">
              {isLoading ? "Carregando..." : profile ? `Favoritos de ${profile.name}` : "Perfil não encontrado"}
            </h1>
            {profile && (
              <p className="mt-1 text-sm text-slate-400">
                {profile.favorites.length} favoritos e {profile.progress.length} itens coletados no Codex
              </p>
            )}
          </div>
          <Button asChild variant="outline" className="border-amber-700/50 text-amber-200 hover:bg-amber-900/30">
            <Link href="/">Voltar ao guia</Link>
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        )}

        {isError && (
          <div className="mx-auto max-w-md rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-8 text-center">
            <UserX className="mx-auto h-10 w-10 text-red-400" />
            <h2 className="gold-text mt-4 text-xl font-bold">Perfil não encontrado</h2>
            <p className="mt-2 text-sm text-slate-400">
              O usuário não existe ou ainda não salvou nenhum favorito. Peça para ele entrar e marcar seus itens favoritos.
            </p>
            <Button asChild className="mt-6 bg-red-800 text-amber-100 hover:bg-red-700">
              <Link href="/perfil"><LogIn className="mr-2 h-4 w-4" /> Entrar no guia</Link>
            </Button>
          </div>
        )}

        {profile && (
          <>
            {profile.progress.length > 0 && (
              <section className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
                <h2 className="font-bold text-amber-300">Codex coletado ({profile.progress.length} itens)</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {profile.progress.map(p => CODEX_ITEMS.find(c => c.key === p.itemId)?.name ?? p.itemId).slice(0, 40).join(" · ")}
                  {profile.progress.length > 40 && ` ...e mais ${profile.progress.length - 40}`}
                </p>
              </section>
            )}

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {Object.entries(grouped).map(([type, bucket]) => {
                const Icon = bucket.Icon;
                return (
                  <section key={type} className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-amber-400" />
                      <h2 className="font-bold text-amber-300">{bucket.label}</h2>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {bucket.items.map((name, i) => (
                        <li key={i} className="text-sm text-slate-300">• {name}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-500">
                      Confira as dicas em <Link href={bucket.path} className="text-amber-400 underline">{bucket.label}</Link>
                    </p>
                  </section>
                );
              })}
            </div>

            {profile.favorites.length === 0 && (
              <p className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-8 text-center text-sm text-slate-400">
                {profile.name} ainda não salvou favoritos. {CLASS_SKILLS.length > 0 && ""}
              </p>
            )}

            <p className="mt-8 text-center text-xs text-slate-600">
              Este link é público e mostra apenas favoritos e progresso de Codex — sem dados pessoais.
              Quer o seu? <Link href="/perfil" className="text-amber-400 underline">Entre e clique em Compartilhar perfil</Link>.
            </p>
          </>
        )}
      </div>
    </>
  );
}
