import { useMemo, useState } from "react";
import { BOSS_RESPAWN, FARM_SPOTS, MAGIC_SQUARE_CHAMBERS, SECTION_IMAGES } from "@shared/guideData";
import PageBanner from "@/components/guide/PageBanner";
import FavButton from "@/components/guide/FavButton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Pickaxe, ShieldAlert, MapPin, Hourglass } from "lucide-react";

export default function Farm() {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });
  const favIds = useMemo(() => new Set(favorites?.map(f => f.itemId) ?? []), [favorites]);
  const [tab, setTab] = useState<"caça" | "mineração" | "magic" | "ervas">("caça");

  return (
    <div>
      <PageBanner
        title="Locais de Farm"
        subtitle="Áreas de caça por nível, spots de Darksteel, câmaras do Magic Square e coleta de ervas. Use a busca do header para encontrar um local específico."
        image={SECTION_IMAGES.farm}
      />
      <div className="container py-10">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["caça", "Caça por Nível"],
              ["mineração", "Darksteel"],
              ["magic", "Magic Square"],
              ["ervas", "Ervas e Coleta"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "rounded-md border px-4 py-1.5 text-sm font-medium transition-all active:scale-[0.97]",
                tab === k
                  ? "border-amber-500 bg-amber-900/40 text-amber-300"
                  : "border-amber-800/40 bg-black/30 text-slate-400 hover:text-amber-200 hover:border-amber-700/50",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "caça" && (
          <section className="mt-6">
            <p className="text-sm text-slate-400 mb-4">
              Escolha a área conforme o nível dos monstros. Áreas sem marca são PvE seguras; áreas com o selo{" "}
              <Badge variant="outline" className="border-red-700/60 text-red-400 text-xs">PvP</Badge> exigem preparo
              (poções, Vigor ativo).
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {FARM_SPOTS.map(f => {
                const isFav = favIds.has(`farm:${f.key}`);
                return (
                  <article
                    key={f.key}
                    id={f.key}
                    className={cn(
                      "rounded-lg border p-4 scroll-mt-24",
                      f.pvp ? "border-red-900/50 bg-red-950/15" : "border-amber-900/40 bg-[oklch(0.19_0.015_280)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="flex items-center gap-2 font-bold text-amber-100">
                          <MapPin className="h-4 w-4 text-amber-500" /> {f.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">{f.area} · Nível {f.level}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {f.pvp && <Badge variant="outline" className="border-red-700/60 text-red-400 text-[10px]">PvP</Badge>}
                        <FavButton itemId={`farm:${f.key}`} itemType="farm" isFavorite={isFav} />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {f.highlights.map(h => (
                        <span key={h} className="rounded border border-slate-700/50 bg-black/30 px-2 py-0.5 text-xs text-slate-300">{h}</span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{f.note}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {tab === "mineração" && (
          <section className="mt-6 space-y-6">
            <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
              <h3 className="gold-text text-xl font-bold">Darksteel: o coração da economia</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                O Darksteel é o recurso mais importante do MIR4 — usado em upgrades, crafting e conversão em DRACO
                (100.000 Darksteel = 1 DRACO). Existem dois métodos principais de obtenção:
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  { t: "Mineração ativa", d: "Retorno maior e controle do spot, mas exige atenção, tem PvP ativo e risco de roubo." },
                  { t: "Mineração AFK", d: "Estável e sem esforço, ideal para longo prazo, mas com retorno menor por sessão." },
                ].map(m => (
                  <div key={m.t} className="rounded-md border border-amber-900/40 bg-black/25 p-4">
                    <p className="font-semibold text-amber-300">{m.t}</p>
                    <p className="mt-1 text-sm text-slate-400">{m.d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-red-900/40 bg-red-950/20 p-4">
                <p className="flex items-center gap-2 font-semibold text-red-300"><ShieldAlert className="h-4 w-4" /> Dicas de segurança</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-300 list-disc list-inside">
                  <li>Escolha spots remotos e farme fora do horário de pico (madrugada).</li>
                  <li>Aumente seu Combat Power para defender spots e entre em um clã forte.</li>
                  <li>Fique perto de monstros: o aggro deles "protege" sua mineração.</li>
                  <li>A famosa "região vermelha" perto de Byeoksan concentra disputas de clã.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="gold-text text-xl font-bold">Melhores locais de mineração</h3>
              <div className="mt-4 overflow-x-auto rounded-lg border border-amber-800/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-900/40 bg-black/40 text-left">
                      <th className="px-4 py-3 font-semibold text-amber-300">Local</th>
                      <th className="px-4 py-3 font-semibold text-amber-300">Nível recomendado</th>
                      <th className="px-4 py-3 font-semibold text-amber-300">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Snake Valley (F3/F4)", "61–95", "O spot de mineração mais famoso; ~12k Darksteel/h AFK em rochas raras"],
                      ["Dark Steel Chamber (Magic Square)", "Qualquer", "2,2% de chance de warp; Darksteel épico e lendário, mas PvP ativo"],
                      ["Secret Mine / Elite Secret Mine", "Baixo-médio", "Bom para itens UC tier 1 e mineração segura"],
                      ["Bicheon Valley (minério)", "40–60", "Acessível para intermediários"],
                    ].map(row => (
                      <tr key={row[0]} className="border-b border-amber-900/20 last:border-0 hover:bg-amber-900/10">
                        {row.map((c, i) => (
                          <td key={i} className={cn("px-4 py-3", i === 0 && "font-medium text-amber-200", i > 0 && "text-slate-300")}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {tab === "magic" && (
          <section className="mt-6 space-y-6">
            <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
              <h3 className="gold-text text-xl font-bold">A mina de ouro do AFK</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                O Magic Square é uma dungeon de salas aleatórias. Use o botão de <strong className="text-amber-300">warp</strong> até
                cair na sala desejada. As câmaras de Training são as únicas <strong className="text-emerald-400">sem PvP</strong> —
                ideais para nível baixo.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-900/40 bg-black/40 text-left">
                      <th className="px-4 py-3 font-semibold text-amber-300">Câmara</th>
                      <th className="px-4 py-3 font-semibold text-amber-300">Chance</th>
                      <th className="px-4 py-3 font-semibold text-amber-300">Propósito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MAGIC_SQUARE_CHAMBERS.map(c => (
                      <tr key={c.name} className="border-b border-amber-900/20 last:border-0 hover:bg-amber-900/10">
                        <td className="px-4 py-3 font-medium text-amber-200">{c.name}</td>
                        <td className="px-4 py-3 text-slate-300">{c.chance}</td>
                        <td className="px-4 py-3 text-slate-300">{c.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-red-900/40 bg-red-950/15 p-5">
              <h3 className="flex items-center gap-2 font-bold text-red-300"><Hourglass className="h-4 w-4" /> Respawn de bosses</h3>
              <p className="mt-2 text-sm text-slate-300">
                Matando bosses com um grupo grande do clã você monopoliza os drops. Horários (UTC+8):
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-900/40 text-left">
                      <th className="px-4 py-2 font-semibold text-red-300">Boss</th>
                      <th className="px-4 py-2 font-semibold text-red-300">Intervalo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BOSS_RESPAWN.map(r => (
                      <tr key={r.boss} className="border-b border-red-900/20 last:border-0">
                        <td className="px-4 py-2 font-medium text-slate-200">{r.boss}</td>
                        <td className="px-4 py-2 text-slate-300">{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {tab === "ervas" && (
          <section className="mt-6">
            <div className="rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5 space-y-4">
              <h3 className="gold-text text-xl font-bold">Progressão de ervas</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Ervas seguem a progressão por área. Farme <strong className="text-amber-300">Lucky Drop</strong> em mobs comuns
                e elites para acelerar a coleta. A coleta ocorre no Gathering Chamber do Magic Square ou nas áreas do
                mundo (Phantasia Desert, Nine Dragon Ice Field).
              </p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Heal Herbs", "Início — coleta básica para poções", "bg-emerald-950/30 border-emerald-800/40"],
                  ["Noirsoul Herb", "Intermediário — farme mobs e elites", "bg-emerald-950/30 border-emerald-800/40"],
                  ["Angelica", "Avançado — usado em poções superiores", "bg-amber-950/30 border-amber-800/40"],
                  ["Eternal Snow Panax", "Endgame — Nine Dragon Ice Field", "bg-red-950/30 border-red-800/40"],
                  ["Azureum Mineral Fluid", "Endgame — caixas lendárias de poção", "bg-red-950/30 border-red-800/40"],
                  ["Red Energy", "Crafte caixas de 100K/1M e venda no Mercado", "bg-violet-950/30 border-violet-800/40"],
                ].map(([n, d, cls]) => (
                  <div key={n as string} className={cn("rounded-md border p-4", cls)}>
                    <p className="font-semibold text-amber-200">{n}</p>
                    <p className="mt-1 text-xs text-slate-400">{d}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                <Pickaxe className="mr-1 inline h-4 w-4 text-amber-500" />
                A <strong className="text-amber-300">Red Energy</strong> coletada pode ser craftada em caixas de 100K/1M de
                energia e vendida no Mercado por ouro — uma forma consistente de farmar riqueza sem entrar em zona de mineração PvP.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
