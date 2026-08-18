import { useState } from "react";
import PageBanner from "@/components/guide/PageBanner";
import CommentsSection from "@/components/guide/CommentsSection";
import { CLASS_SKILLS, SUBCLASS_TIPS, CLASS_VIDEOS, type SkillBuild } from "@shared/guideData";
import ClassVideoPlayer from "@/components/ClassVideoPlayer";
import PvPCompareDialog from "@/components/PvPCompareDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Sparkles, Target, Swords, Moon, Star, ChevronRight } from "lucide-react";
import BuildShare from "@/components/BuildShare";

const SCENARIO_META: Record<string, { icon: React.ReactNode; color: string }> = {
  pve: { icon: <Target className="h-4 w-4" />, color: "text-emerald-400" },
  pvp: { icon: <Swords className="h-4 w-4" />, color: "text-red-400" },
  afk: { icon: <Moon className="h-4 w-4" />, color: "text-violet-400" },
};

const CLASS_IMAGES: Record<string, string> = {
  warrior: "/manus-storage/class-warrior_b55b2474.jpg",
  sorcerer: "/manus-storage/class-sorcerer_9257ccb9.jpg",
  arbalist: "/manus-storage/class-arbalist_05cdc1ee.jpg",
  taoist: "/manus-storage/class-taoist_87d085ab.jpg",
  lancer: "/manus-storage/class-lancer_d7a4f100.jpg",
  darkist: "/manus-storage/class-darkist-portrait_0894e6c9.png",
  lionheart: "/manus-storage/class-lionheart-portrait_0410c572.png",
  spiritsummoner: "/manus-storage/class-spiritsummoner-portrait_52130936.png",
};

export default function Subclasses() {
  const [classKey, setClassKey] = useState("warrior");
  const cls = CLASS_SKILLS.find(c => c.key === classKey) ?? CLASS_SKILLS[0];

  return (
    <div className="min-h-screen pb-16">
      <PageBanner
        title="Guia de Subclasses & Skills"
        subtitle="Árvores de habilidades recomendadas e builds avançadas por classe e cenário — PvE, PvP e farm AFK"
      />

      <div className="container max-w-5xl space-y-8">
        {/* Introdução à subclasse */}
        <Card className="p-5 bg-gradient-to-br from-violet-950/40 to-slate-900/60 border-amber-700/30">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-2">
            <Sparkles className="h-4 w-4" /> O que é a subclasse?
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{SUBCLASS_TIPS.intro}</p>
          <ul className="mt-3 space-y-1.5">
            {SUBCLASS_TIPS.rules.map((r, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-400">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-amber-500/70 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </Card>

        {/* Seletor de classe */}
        <div className="flex flex-wrap gap-2">
          {CLASS_SKILLS.map(c => (
            <button
              key={c.key}
              onClick={() => setClassKey(c.key)}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-semibold transition-all",
                classKey === c.key
                  ? "border-amber-500 bg-amber-950/40 text-amber-300"
                  : "border-slate-700/60 bg-slate-900/50 text-slate-400 hover:border-amber-800/60 hover:text-slate-200",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Cabeçalho da classe */}
        <div className="flex items-center gap-4">
          {CLASS_IMAGES[cls.key] ? (
            <img
              src={CLASS_IMAGES[cls.key]}
              alt={cls.name}
              className="h-24 w-24 rounded-lg border border-amber-700/40 object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-lg border border-amber-700/40 bg-slate-900/60 flex items-center justify-center text-3xl">
              <Swords className="h-10 w-10 text-amber-500/50" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-amber-400">{cls.name}</h2>
            <p className="mt-1 text-xs text-slate-500">{cls.subclassTip}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cls.recommendedSubclasses.map(s => (
                <Badge key={s} variant="outline" className="border-violet-700/50 text-violet-300 text-[10px]">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <PvPCompareDialog />
        </div>

        {/* Gameplay em vídeo */}
        {CLASS_VIDEOS[cls.key] && (
          <ClassVideoPlayer
            videoId={CLASS_VIDEOS[cls.key].id}
            title={CLASS_VIDEOS[cls.key].title}
            className="mt-6"
          />
        )}

        {/* Skills de destaque */}
        <section>
          <h3 className="text-lg font-bold text-amber-400 mb-3">Skills de destaque</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {cls.skillsHighlight.map(s => (
              <Card key={s.name} className="p-4 bg-slate-900/60 border-amber-700/30">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-amber-300 text-sm">{s.name}</h4>
                  <Badge variant="outline" className="border-slate-700/60 text-slate-400 text-[10px] shrink-0">
                    {s.tag}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Builds por cenário */}
        <section>
          <h3 className="text-lg font-bold text-amber-400 mb-3">Builds avançadas</h3>
          <Tabs defaultValue="pve">
            <TabsList className="bg-slate-900/60 border border-amber-800/40">
              <TabsTrigger value="pve" className="data-[state=active]:text-amber-300">PvE / Raids</TabsTrigger>
              <TabsTrigger value="pvp" className="data-[state=active]:text-amber-300">PvP</TabsTrigger>
              <TabsTrigger value="afk" className="data-[state=active]:text-amber-300">Farm AFK</TabsTrigger>
            </TabsList>
            {cls.builds.map(b => (
              <TabsContent key={b.scenario} value={b.scenario}>
                <BuildCard build={b} classKey={cls.key} />
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Árvore recomendada */}
        <section>
          <h3 className="text-lg font-bold text-amber-400 mb-3">Árvore de progressão recomendada</h3>
          <Card className="p-5 bg-black/25 border-amber-700/30">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-3">Ordem de prioridade das skills (nível 1 → nível máximo)</p>
            <ol className="flex flex-wrap items-center gap-y-2">
              {cls.skillOrder.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="rounded-md border border-amber-700/50 bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-200">
                    {s}
                  </span>
                  {i < cls.skillOrder.length - 1 && <span className="text-amber-600/70">→</span>}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">{cls.orderNote}</p>
          </Card>
        </section>

        {/* Dicas avançadas */}
        <section>
          <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" /> Dicas avançadas da {cls.name}
          </h3>
          <div className="space-y-2">
            {cls.advancedTips.map((t, i) => (
              <Card key={i} className="p-3.5 bg-black/30 border-amber-900/40">
                <p className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                  <Badge variant="outline" className="border-amber-800/50 text-amber-500 shrink-0">{i + 1}</Badge>
                  {t}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Comentários */}
        <CommentsSection
          pageKey="skills"
          farmKey={cls.key}
          title={`Dicas da comunidade: ${cls.name} — Builds e Subclasses`}
          placeholder={`Compartilhe uma dica de build ou subclasse para ${cls.name}... (máx. 300 caracteres)`}
        />
      </div>
    </div>
  );
}

function BuildCard({ build, classKey }: { build: SkillBuild; classKey: string }) {
  const meta = SCENARIO_META[build.scenario];
  return (
    <Card className="p-5 bg-slate-900/60 border-amber-700/30">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className={cn("flex items-center gap-2 font-bold text-sm", meta.color)}>
            {meta.icon}
            {build.label}
            <BuildShare build={build} classKey={classKey} />
          </h4>
          <Badge className="bg-black/40 border border-slate-700/60 text-slate-300">{build.focus}</Badge>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {build.skills.map(s => (
              <Badge key={s} variant="outline" className="border-amber-800/40 text-amber-200/90 text-[10px]">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Rotação</p>
          <p className="text-xs text-slate-300 leading-relaxed bg-black/20 rounded-md p-2.5">{build.rotation}</p>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{build.notes}</p>
      </CardContent>
    </Card>
  );
}
