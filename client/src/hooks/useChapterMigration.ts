import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

const CHAPTERS_PLAYED_KEY = "mir4-chapters-played";

function readLocalChapters(): number[] {
  try {
    const raw = localStorage.getItem(CHAPTERS_PLAYED_KEY);
    const arr: number[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter(n => typeof n === "number" && n >= 1 && n <= 21);
  } catch {
    return [];
  }
}

/**
 * Migração automática dos capítulos marcados no navegador para o servidor.
 *
 * Executa uma única vez por sessão, no primeiro momento em que o usuário está
 * logado E a lista do servidor já foi carregada. A migração envia a UNIÃO dos
 * capítulos locais com os do servidor (nunca perde marcações de nenhum dos
 * lados) e apaga a chave do localStorage após o sucesso. Usuários que já têm
 * o localStorage vazio (ou migrado) não enviam nada.
 */
export function useChapterMigration() {
  const { data: me } = trpc.auth.me.useQuery(undefined, { retry: false });
  const { data: serverChapters } = trpc.chapterProgress.list.useQuery(undefined, {
    enabled: me !== undefined && me !== null,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
  const syncMutation = trpc.chapterProgress.sync.useMutation();
  const migrated = useRef(false);

  useEffect(() => {
    if (migrated.current || me === undefined || me === null) return;
    // Ainda carregando a lista do servidor — espera o primeiro fetch.
    if (serverChapters === undefined) return;
    if (serverChapters === null) {
      // Usuário não está logado; sem migração.
      return;
    }

    const local = readLocalChapters();
    const server = new Set(serverChapters.map(r => Number(r.chapter)));

    // Só migra se houver capítulos locais que ainda não estão no servidor.
    const missing = local.filter(n => !server.has(n));
    if (missing.length === 0) {
      // Local vazio ou já migrado — limpa a chave de qualquer forma.
      try {
        localStorage.removeItem(CHAPTERS_PLAYED_KEY);
      } catch {
        /* ignore */
      }
      migrated.current = true;
      return;
    }

    const union = Array.from(new Set([...local, ...serverChapters.map(r => Number(r.chapter))])).sort((a, b) => a - b);
    syncMutation.mutate(
      { chapters: union },
      {
        onSuccess: () => {
          migrated.current = true;
          try {
            localStorage.removeItem(CHAPTERS_PLAYED_KEY);
          } catch {
            /* ignore */
          }
          // Invalida a listagem para as páginas refletirem a união imediatamente.
          trpc.useUtils().chapterProgress.list.invalidate();
        },
        onError: () => {
          // Falha de rede — mantém o localStorage intacto para retry no próximo login.
          migrated.current = false;
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, serverChapters]);
}
