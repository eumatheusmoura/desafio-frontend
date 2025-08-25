"use client";

import { useId, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UsuarioDisplay } from "../types/usuario";

interface DeleteWalletModalProps {
  usuario: UsuarioDisplay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void>;
}

export default function DeleteWalletModal({
  usuario,
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteWalletModalProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (inputValue !== usuario.email) {
      return;
    }

    try {
      setIsDeleting(true);
      await onConfirmDelete();
      setInputValue("");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro na exclusão:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setInputValue("");
    onOpenChange(false);
  };

  const isConfirmationValid = inputValue === usuario.email;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
            aria-hidden="true"
          >
            <Trash2
              className="text-red-600 dark:text-red-400 opacity-80"
              size={16}
            />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">
              Confirmar exclusão da carteira
            </DialogTitle>
            <DialogDescription className="text-left">
              Esta ação não pode ser desfeita. A carteira de{" "}
              <span className="text-foreground font-medium">
                {usuario.nome} {usuario.sobrenome}
              </span>{" "}
              será excluída permanentemente.
              <br />
              <br />
              Para confirmar, digite o email:{" "}
              <span className="text-foreground font-medium text-sm">
                {usuario.email}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={id}>Email da carteira</Label>
              <Input
                id={id}
                type="email"
                placeholder={`Digite ${usuario.email} para confirmar`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>
          </div>
          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive-premium"
              className="flex-1 text-red-100"
              disabled={!isConfirmationValid || isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir carteira"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
