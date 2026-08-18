import { Link } from "wouter";
import { Star, BookOpen, Pickaxe, Swords, Coins, ArrowRight, Flame, Castle, Sparkles, Gem, Calendar, Calculator, Layers, Shield, Package, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_IMAGES } from "@shared/guideData";

const SECTIONS = [
  {
    key: "faq",
    path: "/faq",
    icon: HelpCircle,
    title: "FAQ Comunitária",
    desc: "As melhores dicas da comunidade, classificadas automaticamente pelos votos — upvote e downvote em cada seção.",
    image: SECTION_IMAGES.farm,
    accent: "text-amber-400",
  },
  {
    key: "espiritos",
    path: "/espiritos",
    icon: Star,
    title: "Espíritos",
    desc: "Todos os pets por raridade — UC, Raro, Épico, Lendário e Mítico — com atributos, habilidades e como obter cada um.",
    image: SECTION_IMAGES.spirits,
    accent: "text-violet-400",
  },
  {
    key: "codex",
    path: "/codex",
    icon: BookOpen,
    title: "Codex",
    desc: "Sistema de coleções, bônus por conclusão, ranking do Collection Codex e dicas de farm por categoria.",
    image: SECTION_IMAGES.codex,
    accent: "text-emerald-400",
  },
  {
    key: "farm",
    path: "/farm",
    icon: Pickaxe,
    title: "Locais de Farm",
    desc: "Áreas de caça por nível, spots de Darksteel, câmaras do Magic Square e coleta de ervas.",
    image: SECTION_IMAGES.farm,
    accent: "text-red-400",
  },
  {
    key: "classes",
    path: "/classes",
    icon: Swords,
    title: "Classes",
    desc: "Guia completo das 5 classes — Warrior, Sorcerer, Taoist, Lancer e Arbalist — com skills, combos e builds.",
    image: SECTION_IMAGES.hero,
    accent: "text-amber-400",
  },
  {
    key: "economia",
    path: "/economia",
    icon: Coins,
    title: "Economia",
    desc: "Moedas, Darksteel, token DRACO, funcionamento do Mercado e dicas de acumulação de riqueza.",
    image: SECTION_IMAGES.economy,
    accent: "text-amber-300",
  },
  {
    key: "sabuk",
    path: "/sabuk",
    icon: Castle,
    title: "Sabuk & Guildas",
    desc: "Guerra de Sabuk, Sabuk Clash entre servidores, poderes do Imperador, estratégias de cerco e mecânicas de clã.",
    image: "",
    accent: "text-red-400",
  },
  {
    key: "misterios",
    path: "/misterios",
    icon: Sparkles,
    title: "Mistérios & Conquista",
    desc: "Cadeias de mistérios ocultos com atributos permanentes e a Torre da Conquista com seus 10 edifícios upáveis.",
    image: "",
    accent: "text-violet-400",
  },
  {
    key: "selos",
    path: "/selos",
    icon: Gem,
    title: "Selos & Geminação",
    desc: "Progressão das Magic Stones lacradas — Darksteel, Jade e Dragon Seal — com rotas de farm de Darksteel por estágio.",
    image: "",
    accent: "text-rose-400",
  },
  {
    key: "calendario",
    path: "/calendario",
    icon: Calendar,
    title: "Calendário de Eventos",
    desc: "Horários da Guerra de Sabuk, Sabuk Clash, Magic Square, bosses mundiais e ciclos diários e semanais do servidor.",
    image: "",
    accent: "text-sky-400",
  },
  {
    key: "calculadora",
    path: "/calculadora",
    icon: Calculator,
    title: "Calculadora Darksteel",
    desc: "Estime seus ganhos de Darksteel por hora por selo e área, com projeção de Gold no Mercado e conversão para DRACO.",
    image: "",
    accent: "text-amber-400",
  },
  {
    key: "subclasses",
    path: "/subclasses",
    icon: Layers,
    title: "Subclasses & Skills",
    desc: "Árvores de habilidades recomendadas e builds avançadas — PvE, PvP e AFK — com dicas de subclasse por classe.",
    image: "",
    accent: "text-violet-400",
  },
  {
    key: "equipamentos",
    path: "/equipamentos",
    icon: Shield,
    title: "Equipamentos & Geminação",
    desc: "Slots de equipamento, stats por tipo, custos de enhancement por estágio e o uso de Darksteel, Jade e Dragon Steel em cada grau.",
    image: "",
    accent: "text-emerald-400",
  },
  {
    key: "materiais",
    path: "/materiais",
    icon: Package,
    title: "Materiais & Crafting",
    desc: "Fontes de farm de Darksteel, Copper, Jade, Dragonsteel, Divine Dragon's Soul e reagentes épicos para cada estágio do jogo.",
    image: "",
    accent: "text-violet-400",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-amber-800/40">
        <img
          src={SECTION_IMAGES.hero}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[oklch(0.16_0.01_280)]" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-700/50 bg-black/50 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-amber-300">
              <Flame className="h-3.5 w-3.5" /> Portal de fãs — conteúdo completo e atualizado
            </p>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight">
              <span className="gold-text">O Guia Definitivo</span>
              <br />
              <span className="text-slate-100">de MIR4</span>
            </h1>
            <p className="mt-5 max-w-2xl text-slate-300 text-base md:text-lg leading-relaxed">
              Referência centralizada para todos os sistemas do MMORPG: <strong className="text-amber-300">Espíritos</strong>,{" "}
              <strong className="text-amber-300">Codex</strong>, <strong className="text-amber-300">Locais de Farm</strong>,{" "}
              <strong className="text-amber-300">Classes</strong> e <strong className="text-amber-300">Economia</strong>.
              Faça login para salvar seus favoritos e marcar seu progresso no Codex.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/espiritos"
                className="rounded-md bg-red-800 border border-amber-600/50 px-6 py-3 text-sm font-semibold text-amber-100 hover:bg-red-700 transition-all active:scale-[0.97] shadow-lg shadow-red-900/40"
              >
                Começar pelo Guia de Espíritos
              </Link>
              <Link
                href="/farm"
                className="rounded-md border border-amber-700/50 bg-black/40 px-6 py-3 text-sm font-semibold text-amber-200 hover:bg-amber-900/30 transition-all active:scale-[0.97]"
              >
                Ver Locais de Farm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visão geral */}
      <section className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="gold-text text-2xl md:text-3xl font-bold">O que é o MIR4?</h2>
            <div className="mt-5 space-y-4 text-slate-300 leading-relaxed">
              <p>
                <strong className="text-amber-200">MIR4</strong> é um MMORPG gratuito de ação desenvolvido pela
                sul-coreana <strong className="text-amber-200">Wemade</strong>, lançado globalmente em agosto de 2021 para
                PC e dispositivos móveis. Sucessor espiritual da lendária série <em>The Legend of Mir</em>, o jogo se
                destaca pelo combate em tempo real, mundo aberto com PvP livre, sistema de mineração de{" "}
                <strong className="text-amber-200">Darksteel</strong> e integração com o token <strong className="text-amber-200">DRACO</strong>.
              </p>
              <p>
                Este portal reúne tudo que você precisa para evoluir: <strong className="text-amber-200">Espíritos</strong> por
                raridade, sistema de <strong className="text-amber-200">Codex</strong>, locais de farm por nível, guias
                individuais das cinco classes e um panorama completo da economia do jogo.
              </p>
            </div>

            <div className="mt-8 rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-5">
              <h3 className="font-semibold text-amber-300 mb-3">Começando do zero</h3>
              <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
                <li>Escolha sua classe: <span className="text-amber-200">Arbalist</span> para farm seguro, <span className="text-amber-200">Warrior</span> para tanque, <span className="text-amber-200">Lancer</span> para máximo DPS.</li>
                <li>Siga as missões principais — o auto-questing leva ao nível ~40.</li>
                <li>Entre em um clã cedo: raids, recursos e proteção.</li>
                <li>Foque no <span className="text-amber-200">Codex</span>: bônus permanentes por coleção.</li>
                <li>Comece a minerar: Darksteel é o recurso mais importante.</li>
                <li>Consiga um espírito — até espíritos UC como o <span className="text-amber-200">Khalion (+20% EXP)</span> aceleram muito.</li>
              </ol>
            </div>
          </div>

          <aside className="space-y-4">
            <h2 className="gold-text text-2xl font-bold">Sistemas principais</h2>
            {[
              ["Classes", "5 classes com subclasse intercambiável"],
              ["Espíritos", "Pets com bônus passivos e ativos"],
              ["Codex", "Coleção permanente com bônus de atributos"],
              ["Mineração / Coleta", "Darksteel, ervas e energia — motor da economia"],
              ["Magic Square", "Dungeon de salas aleatórias com EXP, bosses e recursos"],
              ["Mercado", "Comércio de itens por Gold (nível 40+)"],
              ["Clãs", "Guerras, boss raids e economia compartilhada"],
              ["DRACO", "Token conversível de 100.000 Darksteel"],
            ].map(([t, d]) => (
              <div key={t} className="flex gap-3 rounded-md border border-amber-900/40 bg-black/25 px-4 py-3">
                <div className="h-1.5 w-1.5 shrink-0 translate-y-2 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-semibold text-amber-200">{t}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Links de acesso rápido */}
      <section className="border-t border-amber-800/30 bg-[oklch(0.13_0.012_280)] py-14">
        <div className="container">
          <h2 className="gold-text text-2xl md:text-3xl font-bold text-center">Seções do Guia</h2>
          <p className="text-center text-slate-400 mt-2 text-sm">Navegue diretamente para o que você precisa</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map((s, i) => (
              <Link
                key={s.key}
                href={s.path}
                className={cn(
                  "group relative overflow-hidden rounded-lg border border-amber-800/40 bg-[oklch(0.19_0.015_280)] p-0 transition-all hover:border-amber-600/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/40",
                )}
              >
                {s.image && (
                  <img src={s.image} alt="" aria-hidden className="h-28 w-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                )}
                <div className={cn("p-5", i === 0 ? "sm:col-span-2 lg:col-span-1" : "")}>
                  <div className="flex items-center gap-3">
                    <s.icon className={cn("h-5 w-5", s.accent)} />
                    <h3 className="font-bold text-amber-100">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    Abrir guia <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
