import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CODEX_ITEMS, CLASSES, FARM_SPOTS, RAIDS, SPIRITS, SABUK_CONTENT, MYSTERIES, EQUIPMENT_TYPES, MATERIALS } from "@shared/guideData";
import { Star, BookOpen, Pickaxe, Swords, Coins, LogIn, Loader2, Skull, Castle, Sparkles, Gem, Shield, Package } from "lucide-react";

const SECTION_META: Record<string, { label: string; path: string; Icon: typeof Star }> = {
  spirit: { label: "Espíritos", path: "/espiritos", Icon: Star },
  codex: { label: "Codex", path: "/codex", Icon: BookOpen },
  farm: { label: "Locais de Farm", path: "/farm", Icon: Pickaxe },
  class: { label: "Classes", path: "/classes", Icon: Swords },
  economy: { label: "Economia", path: "/economia", Icon: Coins },
  raid: { label: "Raids e Bosses", path: "/raids", Icon: Skull },
  boss: { label: "Raids e Bosses", path: "/raids", Icon: Skull },
  sabuk: { label: "Sabuk & Guildas", path: "/sabuk", Icon: Castle },
  mystery: { label: "Mistérios", path: "/misterios", Icon: Sparkles },
  seal: { label: "Selos", path: "/selos", Icon: Gem },
  gear: { label: "Equipamentos", path: "/equipamentos", Icon: Shield },
  materials: { label: "Materiais", path: "/materiais", Icon: Package },
};

export default function Profile() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();

  const { data: favorites, isLoading: favLoading } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: progress, isLoading: progLoading } = trpc.codexProgress.list.useQuery(undefined, { enabled: isAuthenticated });

  const toggleFav = trpc.favorites.toggle.useMutation({
    onSuccess: () => utils.favorites.list.invalidate(),
  });
  const toggleCodex = trpc.codexProgress.toggle.useMutation({
    onSuccess: () => utils.codexProgress.list.invalidate(),
  });

  const collectedIds = new Set(progress?.map(p => p.itemId) ?? []);
  const codexTotal = CODEX_ITEMS.length;
  const codexDone = progress?.length ?? 0;

  const resolveTitle = (fav: { itemId: string; itemType: string }) => {
    const [type, key] = fav.itemId.split(":");
    switch (fav.itemType) {
      case "spirit": return SPIRITS.find(s => s.key === key)?.name ?? key;
      case "codex": return CODEX_ITEMS.find(c => c.key === key)?.name ?? key;
      case "farm": return FARM_SPOTS.find(f => f.key === key)?.name ?? key;
      case "class": return CLASSES.find(c => c.key === key)?.name ?? key;
      case "sabuk":
        if (key === "torre-conquista") return "Torre da Conquista";
        return SABUK_CONTENT.find(s => s.key === key)?.title ?? key;
      case "mystery": return MYSTERIES.find(m => m.key === key)?.name ?? key;
      case "seal": {
        const sealMap: Record<string, string> = { "darksteel-seal": "Darksteel Seal", "jade-seal": "Jade Seal", "dragon-seal": "Dragon Seal" };
        return sealMap[key] ?? key;
      }
      case "raid":
      case "boss": return RAIDS.find(r => r.key === key)?.name ?? key;
      case "gear": {
        const equip = EQUIPMENT_TYPES.find(e => e.key === key);
        if (equip) return `Equipamento: ${equip.slot} (${equip.examples.join(", ")})`;
        return key ?? type;
      }
      case "materials": {
        const mat = MATERIALS.find(m => m.key === key);
        if (mat) return `Material: ${mat.name}`;
        return key ?? type;
      }
      default: return key ?? type;
    }
  };

  if (!loading && !isAuthenticated) {
    return (
      <div className="container py-20">
        <div className="mx-auto max-w-md rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-8 text-center">
          <LogIn className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="gold-text mt-4 text-2xl font-bold">Área do Jogador</h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Entre com sua conta para salvar favoritos, marcar itens do Codex como coletados e acompanhar seu
            progresso.
          </p>
          <Button onClick={() => startLogin()} className="mt-6 w-full bg-red-800 hover:bg-red-700 text-amber-100 border border-amber-700/50">
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="gold-text text-3xl font-bold">Meu Perfil</h1>
          <p className="mt-1 text-sm text-slate-400">
            Olá, <strong className="text-amber-200">{user.name ?? "aventureiro"}</strong> — organize seus favoritos e seu
            progresso no Codex.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const url = `${window.location.origin}/share/${user.id}`;
              navigator.clipboard
                .writeText(url)
                .then(() => toast.success("Link copiado! Envie para seus amigos: " + url))
                .catch(() => toast.error("Não foi possível copiar o link"));
            }}
            className="border-amber-700/50 text-amber-200 hover:bg-amber-900/30"
          >
            Compartilhar perfil
          </Button>
          <Button variant="outline" onClick={() => logout()} className="border-amber-700/50 text-amber-200 hover:bg-amber-900/30">
            Sair
          </Button>
        </div>
      </div>

      {/* Progresso codex */}
      <section className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
        <h2 className="font-bold text-amber-300">Progresso no Codex</h2>
        {progLoading ? (
          <Loader2 className="mt-3 h-5 w-5 animate-spin text-amber-500" />
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-300">
              {codexDone} de {codexTotal} itens marcados como coletados ({Math.round((codexDone / codexTotal) * 100)}%).
            </p>
            {progress && progress.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {progress.map(p => {
                  const item = CODEX_ITEMS.find(c => c.key === p.itemId);
                  if (!item) return null;
                  return (
                    <button
                      key={p.itemId}
                      onClick={() => toggleCodex.mutate({ itemId: p.itemId, collected: false })}
                      className="rounded border border-emerald-700/50 bg-emerald-950/40 px-2 py-1 text-xs text-emerald-300 hover:bg-red-950/40 hover:text-red-300 hover:border-red-700/50 transition-colors"
                      title="Desmarcar item coletado"
                    >
                      {item.name} ✕
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Favoritos */}
      <section className="mt-8">
        <h2 className="gold-text text-2xl font-bold">Meus favoritos</h2>
        {favLoading ? (
          <Loader2 className="mt-3 h-5 w-5 animate-spin text-amber-500" />
        ) : favorites && favorites.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {favorites.map(f => {
              const [type] = f.itemId.split(":");
              const meta = SECTION_META[type] ?? SECTION_META.spirit;
              const Icon = meta.Icon;
              return (
                <Link
                  key={f.itemId}
                  href={meta.path}
                  className="flex items-center gap-3 rounded-lg border border-amber-900/40 bg-[oklch(0.19_0.015_280)] px-4 py-3 hover:border-amber-600/60 transition-colors"
                >
                  <Icon className="h-5 w-5 shrink-0 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-amber-100">{resolveTitle(f)}</p>
                    <p className="text-xs text-slate-500">{meta.label}</p>
                  </div>
                  <button
                    aria-label="Remover favorito"
                    onClick={e => { e.preventDefault(); toggleFav.mutate({ itemId: f.itemId, itemType: f.itemType }); }}
                    className="text-xs text-slate-500 hover:text-red-400"
                  >
                    remover
                  </button>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-amber-900/40 bg-black/25 p-8 text-center">
            <Star className="mx-auto h-8 w-8 text-amber-600/50" />
            <p className="mt-3 text-sm text-slate-400">
              Você ainda não salvou favoritos. Explore o guia e clique na estrela de qualquer item para salvá-lo aqui.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button asChild size="sm" variant="outline" className="border-amber-700/50 text-amber-200">
                <Link href="/espiritos">Ver Espíritos</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-amber-700/50 text-amber-200">
                <Link href="/farm">Ver Locais de Farm</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
