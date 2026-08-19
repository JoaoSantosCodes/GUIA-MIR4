import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { cn } from "@/lib/utils";
import { MessageSquare, Trash2, UserCircle2, Loader2, ThumbsUp, ThumbsDown, Crown } from "lucide-react";

/** Limiar de upvotes que qualifica uma dica como "Dica de Ouro". */
export const GOLD_TIP_UPVOTES = 10;

interface Props {
  farmKey: string;
  title?: string;
  /** Página onde o comentário vive (farm | sabuk | mystery | seal | skills | gear | classes | economy | raids) */
  pageKey?: "farm" | "sabuk" | "mystery" | "seal" | "skills" | "gear" | "materials" | "classes" | "economy" | "raids";
  placeholder?: string;
}

export default function CommentsSection({
  farmKey,
  title = "Dicas da comunidade",
  pageKey = "farm" as "farm" | "sabuk" | "mystery" | "seal" | "skills" | "gear" | "materials" | "classes" | "economy" | "raids",
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

  /** Voto atual do usuário em cada comentário desta seção. */
  const commentIds = useMemo(() => (comments ?? []).map(c => c.id).slice(0, 200), [comments]);
  const { data: myVotes } = trpc.comments.myVotes.useQuery(
    { commentIds },
    { enabled: isAuthenticated && commentIds.length > 0 },
  );
  const myVoteMap = useMemo(
    () => new Map((myVotes ?? []).map(v => [v.commentId, v.vote])),
    [myVotes],
  );

  const commentsWithNames = useMemo(() => {
    const list = (comments ?? []).map(c => ({
      ...c,
      score: (c.upvotes ?? 0) - (c.downvotes ?? 0),
    }));
    // Best tips first (by score), then newest
    return list.sort((a, b) => b.score - a.score || b.id - a.id);
  }, [comments]);

  /** Voto registrado por usuário: previne voto duplo e permite alterar/remover o voto. */
  const setUserVote = trpc.comments.setUserVote.useMutation({
    onMutate: async ({ commentId, vote: nextVote }) => {
      await utils.comments.list.cancel(queryInput);
      const prev = utils.comments.list.getData(queryInput);
      const prevVote = myVoteMap.get(commentId) ?? 0;
      utils.comments.list.setData(queryInput, old =>
        old?.map(c => {
          if (c.id !== commentId) return c;
          let up = c.upvotes ?? 0;
          let down = c.downvotes ?? 0;
          if (prevVote === 1) up = Math.max(0, up - 1);
          if (prevVote === -1) down = Math.max(0, down - 1);
          if (nextVote === 1) up += 1;
          if (nextVote === -1) down += 1;
          return { ...c, upvotes: up, downvotes: down };
        }) ?? old,
      );
      return { prev, prevVote };
    },
    onError: (_err, _input, ctx) => {
      utils.comments.list.setData(queryInput, ctx?.prev);
      toast.error("Falha ao registrar o voto");
    },
    onSettled: () => {
      invalidate();
      utils.comments.myVotes.invalidate();
    },
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
              const myVote = myVoteMap.get(c.id) ?? 0;
              const isGoldTip = (c.upvotes ?? 0) >= GOLD_TIP_UPVOTES;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "relative rounded-md border px-3 py-2 text-sm",
                    isGoldTip
                      ? "border-amber-500/70 bg-gradient-to-br from-amber-950/40 to-black/30"
                      : isMine
                        ? "border-amber-700/50 bg-amber-950/20"
                        : "border-slate-800/60 bg-black/20",
                  )}
                >
                  {isGoldTip && (
                    <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-600 to-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-sm shadow-amber-500/30">
                      <Crown className="h-3 w-3" />
                      Dica de Ouro
                    </div>
                  )}
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
                        className={cn("h-6 w-6", myVote === 1 ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400")}
                        aria-label="Votar a favor"
                        onClick={() => setUserVote.mutate({ commentId: c.id, vote: myVote === 1 ? 0 : 1 })}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <span className={cn("min-w-6 text-center text-xs font-semibold", (c.score ?? 0) > 0 ? "text-emerald-400" : (c.score ?? 0) < 0 ? "text-red-400" : "text-slate-500")}>
                        {c.score ?? 0}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn("h-6 w-6", myVote === -1 ? "text-red-400" : "text-slate-500 hover:text-red-400")}
                        aria-label={myVote === -1 ? "Remover voto contra" : "Votar contra"}
                        onClick={() => setUserVote.mutate({ commentId: c.id, vote: myVote === -1 ? 0 : -1 })}
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
