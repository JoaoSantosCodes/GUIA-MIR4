import { useState } from "react";
import { Play, MonitorPlay } from "lucide-react";

/**
 * Player de vídeo do YouTube para as páginas de Classes e Subclasses.
 * Carregamento lazy: o iframe só é criado quando o usuário clica em "Assistir".
 * Usa youtube-nocookie e inicia pausado (sem autoplay) por padrão.
 */
export default function ClassVideoPlayer({
  videoId,
  title,
  className,
}: {
  videoId: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <MonitorPlay className="h-4 w-4" /> Gameplay em vídeo — {title}
        </p>
        {!playing && (
          <span className="rounded-full border border-slate-700 bg-black/40 px-2 py-0.5 text-[10px] text-slate-400">
            pausado por padrão — ative o som conforme preferir
          </span>
        )}
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-amber-900/40 bg-black/60">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Assistir: ${title}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-amber-950/20"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500 bg-black/60 text-amber-400 shadow-lg">
              <Play className="h-8 w-8 translate-x-0.5" />
            </span>
            <span className="rounded-md border border-slate-700 bg-black/70 px-3 py-1 text-xs text-slate-300">
              Assistir gameplay
            </span>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
