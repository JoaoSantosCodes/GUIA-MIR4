import { cn } from "@/lib/utils";

interface PageBannerProps {
  title: string;
  subtitle: string;
  image?: string;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * Cabeçalho temático de cada seção: fundo com textura escura,
 * título dourado estilo épico e descrição.
 */
export default function PageBanner({ title, subtitle, image, className, actions }: PageBannerProps) {
  return (
    <div
      className={cn("section-banner relative overflow-hidden border-b border-amber-800/40", className)}
    >
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[oklch(0.16_0.01_280)]" />
      <div className="container relative py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="gold-text text-3xl md:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">{subtitle}</p>
          </div>
          {actions && <div className="flex gap-2 pb-1">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
