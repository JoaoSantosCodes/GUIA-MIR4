import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { cn } from "@/lib/utils";
import { MessageSquare, Trash2, UserCircle2, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  farmKey: string;
  title?: string;
  /** Página onde o comentário vive (farm | sabuk | mystery | seal) */
  pageKey?: "farm" | "sabuk" | "mystery" | "seal";
  placeholder?: string;
}

export default function CommentsSection({
  farmKey,
  title = "Dicas da comunidade",
  pageKey = "farm" as "farm" | "sabuk" | "mystery" | "seal",
  placeholder = "Compartilhe uma dica sobre este local... (máx. 300 caracteres)",
}: Props) {
  const { isAuthenticated, user } = useAuth();
  const [content, setContent] = useState("");
  const utils = trpc.useUtils();
  const queryInput = { pageKey, farmKey } as const;

  const { data: comments, isLoading } = trpc.comments.list.useQuery(
    queryInput,
    { refetchInterval: 30_000 },
  );
  const { data: myFavs } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });

  const commentsWithNames = useMemo(() => {
    const list = (comments ?? []).map(c => ({
      ...c,
      score: (c.upvotes ?? 0) - (c.downvotes ?? 0),
    }));
    // Best tips first (by score), then newest
    return list.sort((a, b) => b.score - a.score || b.id - a.id);
  }, [comments]);

  const vote = trpc.comments.vote.useMutation({
    onMutate: async ({ id, kind, delta }) => {
      await utils.comments.list.cancel(queryInput);
      const prev = utils.comments.list.getData(queryInput);
      utils.comments.list.setData(queryInput, old =>
        old?.map(c =>
          c.id === id
            ? { ...c, upvotes: kind === "up" ? Math.max(0, (c.upvotes ?? 0) + delta) : (c.upvotes ?? 0), downvotes: kind === "down" ? Math.max(0, (c.downvotes ?? 0) + delta) : (c.downvotes ?? 0) }
            : c,
        ) ?? old,
      );
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      utils.comments.list.setData(queryInput, ctx?.prev);
      toast.error("Falha ao registrar o voto");
    },
    onSettled: () => invalidate(),
  });

  const invalidate = () => utils.comments.list.invalidate(queryInput);

  const add = trpc.comments.add.useMutation({
    onMutate: async () => {
      await utils.comments.list.cancel(queryInput);
      const prev = utils.comments.list.getData(queryInput);
      const optimistic = {
        id: -Date.now(),
        userId: user?.id ?? 0,
        farmKey,
        content,
        createdAt: new Date(),
        userName: user?.name ?? user?.email ?? "Jogador",
      };
      utils.comments.list.setData(queryInput, old => [...(old ?? []), optimistic] as typeof old);
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      utils.comments.list.setData(queryInput, ctx?.prev);
      toast.error("Falha ao publicar a dica");
    },
    onSettled: () => invalidate(),
  });

  const remove = trpc.comments.remove.useMutation({
    onMutate: async () => {
      await utils.comments.list.cancel(queryInput);
      const prev = utils.comments.list.getData(queryInput);
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      utils.comments.list.setData(queryInput, ctx?.prev);
      toast.error("Falha ao excluir a dica");
    },
    onSettled: () => invalidate(),
  });

  return (
    <div className="mt-4 rounded-lg border border-amber-900/40 bg-black/30 p-4">
      <h4 className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-3">
        <MessageSquare className="h-4 w-4" /> {title}
      </h4>

      <div className="space-y-2">
        {isLoading ? (
          <p className="flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-3 w-3 animate-spin" /> Carregando dicas...</p>
        ) : commentsWithNames.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Nenhuma dica ainda — seja o primeiro a compartilhar!</p>
        ) : (
          <>
            <p className="text-xs text-slate-600 mb-2">Ordenadas pelas dicas mais votadas pela comunidade.</p>
            {commentsWithNames.map(c => {
              const isMine = isAuthenticated && (c as { userId?: number }).userId === user?.id;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm",
                    isMine ? "border-amber-700/50 bg-amber-950/20" : "border-slate-800/60 bg-black/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-xs text-amber-300/80">
                      <UserCircle2 className="h-3.5 w-3.5" />
                      {(c as { userName?: string }).userName ?? "Jogador"}
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString("pt-BR")} {new Date(c.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-slate-500 hover:text-emerald-400"
                        aria-label="Votar a favor"
                        onClick={() => vote.mutate({ id: c.id, kind: "up", delta: 1 })}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <span className={cn("min-w-6 text-center text-xs font-semibold", (c.score ?? 0) > 0 ? "text-emerald-400" : (c.score ?? 0) < 0 ? "text-red-400" : "text-slate-500")}>
                        {c.score ?? 0}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-slate-500 hover:text-red-400"
                        aria-label="Votar contra"
                        onClick={() => vote.mutate({ id: c.id, kind: "down", delta: 1 })}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                      {isMine && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-slate-500 hover:text-red-400"
                          aria-label="Excluir minha dica"
                          onClick={() => remove.mutate({ id: c.id })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-slate-300 leading-relaxed">{c.content}</p>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="mt-3">
        {isAuthenticated ? (
          <div className="flex gap-2">
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={placeholder}
              maxLength={300}
              className="min-h-16 bg-[oklch(0.2_0.02_280)] border-amber-800/50 text-amber-100 placeholder:text-slate-600 text-sm"
            />
            <Button
              onClick={() => {
                const trimmed = content.trim();
                if (trimmed.length < 3) {
                  toast.error("Escreva pelo menos 3 caracteres");
                  return;
                }
                add.mutate({ pageKey, farmKey, content: trimmed.slice(0, 300) });
                setContent("");
              }}
              disabled={add.isPending}
              className="self-end bg-red-800 hover:bg-red-700 text-amber-100 border border-amber-700/50 h-9 whitespace-nowrap"
            >
              {add.isPending ? "Publicando..." : "Publicar dica"}
            </Button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Button size="sm" onClick={() => startLogin()} className="gap-1.5 bg-red-800 hover:bg-red-700 text-amber-100 border border-amber-700/50 h-7">
              Entrar
            </Button>
            para compartilhar dicas com a comunidade.
          </p>
        )}
      </div>
    </div>
  );
}
