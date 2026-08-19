import { useMemo } from "react";
import { CLASSES, CLASS_VIDEOS } from "@shared/guideData";
import ClassVideoPlayer from "@/components/ClassVideoPlayer";
import PageBanner from "@/components/guide/PageBanner";
import CommentsSection from "@/components/guide/CommentsSection";
import FavButton from "@/components/guide/FavButton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Shield, Sparkles, Crosshair, Heart, Swords, ThumbsUp, ThumbsDown, ListOrdered, Wrench, Lightbulb } from "lucide-react";

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Tanque: Shield,
  "DPS Mágico": Sparkles,
  "DPS Físico à Distância": Crosshair,
  "Suporte / Curandeiro": Heart,
  "DPS Híbrido": Swords,
};

export default function Classes() {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });
  const favIds = useMemo(() => new Set(favorites?.map(f => f.itemId) ?? []), [favorites]);

  return (
    <div>
      <PageBanner
        title="Guia de Classes"
        subtitle="Oito classes, cada uma com papel definido: Warrior (tanque), Sorcerer (DPS mágico), Taoist (suporte), Lancer (DPS híbrido), Arbalist (DPS à distância), Darkist (veneno/maldições), Lionheart (cargas/suporte) e Invocador/Spirit Summoner — a 8ª classe, lançada no Capítulo 21 (agosto de 2026)."
        image={undefined}
        className="!py-10"
      />
      <div className="container py-10">
        <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5 mb-10">
          <h3 className="font-bold text-amber-300 mb-2">Sistema de subclasse e dicas de progressão</h3>
          <ul className="space-y-1.5 text-sm text-slate-300 list-disc list-inside">
            <li>Você pode <strong className="text-amber-200">trocar de classe</strong> usando a subclasse para atividades específicas (ex.: Arbalist só para farmar EXP).</li>
            <li>Use sua subclasse com set de EXP (+Hunting EXP) para levelar alts rapidamente.</li>
            <li>Troque de classe (Class Change) após o nível 50 conforme a meta do servidor.</li>
            <li>Para iniciantes, a <strong className="text-amber-200">Arbalist</strong> é a escolha mais recomendada.</li>
          </ul>
        </div>

        <div className="space-y-12">
          {CLASSES.map(c => {
            const RoleIcon = ROLE_ICONS[c.role] ?? Swords;
            const isFav = favIds.has(`class:${c.key}`);
            return (
              <article
                key={c.key}
                id={c.key}
                className="scroll-mt-24 overflow-hidden rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)]"
              >
                <div className="grid md:grid-cols-[320px_1fr]">
                  <div className="relative h-48 md:h-auto">
                    <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span className="rounded-full border border-amber-700/50 bg-black/60 px-3 py-1 text-xs font-semibold text-amber-300">
                        {c.role}
                      </span>
                      <span className="rounded-full border border-slate-600/50 bg-black/60 px-3 py-1 text-xs text-slate-300">
                        {c.gender}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="gold-text flex items-center gap-2 text-2xl font-bold">
                          <RoleIcon className="h-6 w-6 text-amber-500" /> {c.name}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">{c.description}</p>
                      </div>
                      <FavButton itemId={`class:${c.key}`} itemType="class" isFavorite={isFav} />
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-md border border-emerald-900/40 bg-emerald-950/20 p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400"><ThumbsUp className="h-3.5 w-3.5" /> Pontos fortes</p>
                        <ul className="mt-1.5 space-y-1">
                          {c.strengths.map(s => (
                            <li key={s} className="text-xs text-slate-300 list-disc list-inside">{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-md border border-red-900/40 bg-red-950/20 p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-red-400"><ThumbsDown className="h-3.5 w-3.5" /> Fraquezas</p>
                        <ul className="mt-1.5 space-y-1">
                          {c.weaknesses.map(s => (
                            <li key={s} className="text-xs text-slate-300 list-disc list-inside">{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-amber-300"><Sparkles className="h-4 w-4" /> Skills principais</h3>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {c.skills.map(s => (
                          <div key={s.name} className="rounded-md border border-amber-900/40 bg-black/25 px-3 py-2">
                            <p className="text-xs font-semibold text-amber-200">{s.name}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{s.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-amber-300"><ListOrdered className="h-4 w-4" /> Combos</h3>
                      <ul className="mt-2 space-y-1.5">
                        {c.combos.map(cb => (
                          <li key={cb} className="rounded-md border-l-2 border-amber-600/60 bg-black/25 px-3 py-2 text-xs text-slate-300">{cb}</li>
                        ))}
                      </ul>
                    </div>

                    {CLASS_VIDEOS[c.key] && (
                      <ClassVideoPlayer
                        videoId={CLASS_VIDEOS[c.key].id}
                        title={CLASS_VIDEOS[c.key].title}
                        className="mt-4"
                      />
                    )}

                    <p className={cn("mt-4 rounded-md border px-3 py-2 text-xs", "border-red-900/40 bg-red-950/15 text-slate-300")}>
                      <Swords className="mr-1 inline h-3.5 w-3.5 text-red-400" />
                      <span className="font-semibold text-red-300">Estratégia: </span>{c.strategy}
                    </p>

                    <div className="mt-4">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-amber-300"><Wrench className="h-4 w-4" /> Recomendações de Build</h3>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        {c.build.map(b => (
                          <div key={b.title} className="rounded-md border border-violet-900/40 bg-violet-950/15 px-3 py-2">
                            <p className="text-xs font-semibold text-violet-300">{b.title}</p>
                            <p className="mt-1 text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      <section>
  <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
    <Lightbulb className="h-6 w-6" />
    Dicas da comunidade — Classes
  </h2>
  <CommentsSection pageKey="classes" farmKey="geral" title="Classes" />
</section>
</div>
    </div>
  );
}
