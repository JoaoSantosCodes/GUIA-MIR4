import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import type { FavoriteItemType } from "@shared/guideData";

interface FavButtonProps {
  itemId: string;
  itemType: FavoriteItemType;
  isFavorite: boolean;
}

export default function FavButton({ itemId, itemType, isFavorite }: FavButtonProps) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [pending, setPending] = useState(isFavorite);

  const toggle = trpc.favorites.toggle.useMutation({
    onMutate: async () => {
      await utils.favorites.list.cancel();
      const prev = utils.favorites.list.getData();
      utils.favorites.list.setData(undefined, old =>
        old?.filter(f => f.itemId !== itemId) ?? [],
      );
      setPending(!isFavorite);
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      utils.favorites.list.setData(undefined, ctx?.prev);
      setPending(isFavorite);
      toast.error("Falha ao salvar favorito");
    },
    onSettled: () => {
      utils.favorites.list.invalidate();
    },
  });

  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={() => {
        if (!isAuthenticated) {
          toast.info("Entre com sua conta para salvar favoritos", {
            action: { label: "Entrar", onClick: () => startLogin() },
          });
          return;
        }
        toggle.mutate({ itemId, itemType });
      }}
      className="shrink-0 transition-transform active:scale-90"
    >
      <Star
        className={`h-5 w-5 ${pending ? "fill-amber-400 text-amber-400" : "text-amber-600/60"}`}
      />
    </Button>
  );
}
