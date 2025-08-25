"use client";

import React, { useState, useId, useEffect } from "react";
import { WalletIcon, Bitcoin, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CurrencyInput } from "./ui/currency-input";
import { UsuariosService } from "../lib/services/usuarios";
import { useMultiExchangeRate } from "../hooks/use-multi-exchange-rate";
import type { Usuario, UsuarioDisplay } from "../types/usuario";
import {
  walletFormSchema,
  type WalletFormData,
  parseValueToNumber,
} from "../lib/schemas/wallet-schema";

interface EditWalletModalProps {
  usuario: UsuarioDisplay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (usuario: Usuario) => void;
}

function calculateBTCFromValue(
  valorFiat: number,
  exchangeRate: number
): string {
  if (exchangeRate <= 0) {
    return "0.00000000";
  }

  const btcAmount = valorFiat / exchangeRate;

  return btcAmount.toFixed(8);
}

export default function EditWalletModal({
  usuario,
  open,
  onOpenChange,
  onSuccess,
}: EditWalletModalProps) {
  const id = useId();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [btcAmount, setBtcAmount] = useState("0.00000000");

  const [originalUser, setOriginalUser] = useState<Usuario | null>(null);

  const [isChangingCurrency, setIsChangingCurrency] = useState(false);

  useEffect(() => {
    if (open && usuario) {
      const fetchUserData = async () => {
        try {
          const usuarios = await UsuariosService.getUsuarios();
          const userData = usuarios.find((u) => u.id === usuario.id);
          if (userData) {
            setOriginalUser(userData);
          }
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
        }
      };
      fetchUserData();
    }
  }, [open, usuario]);

  const form = useForm<WalletFormData>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      email: "",
      valorCompra: "",
      moeda: "BRL",
    },
  });

  useEffect(() => {
    if (originalUser) {
      const valorFiat = parseFloat(originalUser.valor_carteira_fiat || "0");
      form.reset({
        nome: originalUser.nome,
        sobrenome: originalUser.sobrenome,
        email: originalUser.email,
        valorCompra: valorFiat > 0 ? valorFiat.toString() : "",
        moeda: (originalUser.moeda_fiat || "BRL") as "BRL" | "USD" | "EUR",
      });
    }
  }, [originalUser]);

  const valorCompra = form.watch("valorCompra");
  const moeda = form.watch("moeda");

  const {
    getRate,
    isLoading,
    getError,
    getLastUpdate,
    preloadCurrency,
    fetchImmediately,
  } = useMultiExchangeRate();

  const exchangeRate = getRate(moeda);
  const rateLoading = isLoading(moeda);
  const rateError = getError(moeda);
  const lastUpdate = getLastUpdate(moeda);

  React.useEffect(() => {
    if (!rateLoading && !exchangeRate) {
      const timer = setTimeout(() => {
        preloadCurrency(moeda);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [moeda, preloadCurrency, rateLoading, exchangeRate, form]);

  React.useEffect(() => {
    if (open && moeda) {
      const refreshRate = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (!exchangeRate || rateError) {
            if (fetchImmediately) {
              fetchImmediately(moeda);
            } else {
              preloadCurrency(moeda);
            }
          }
        } catch (err) {
          console.error("Erro ao refresh da cotação:", err);
        }
      };
      refreshRate();
    }
  }, [open, moeda, preloadCurrency, fetchImmediately, exchangeRate, rateError]);

  React.useEffect(() => {
    if (isChangingCurrency) {
      return;
    }

    if (valorCompra && exchangeRate) {
      const valorCompraLimpo = valorCompra.replace(/[^\d,.]/g, "");
      let valorNumerico: number;

      if (moeda === "USD") {
        valorNumerico = parseFloat(valorCompraLimpo.replace(/,/g, ""));
      } else {
        if (valorCompraLimpo.includes(",")) {
          valorNumerico = parseFloat(
            valorCompraLimpo.replace(/\./g, "").replace(",", ".")
          );
        } else {
          valorNumerico = parseFloat(valorCompraLimpo.replace(/\./g, ""));
        }
      }

      if (valorNumerico > 0) {
        const btcCalculado = calculateBTCFromValue(valorNumerico, exchangeRate);
        setBtcAmount(btcCalculado);
      } else {
        setBtcAmount("0.00000000");
      }
    } else {
      setBtcAmount("0.00000000");
    }
  }, [valorCompra, moeda, exchangeRate, isChangingCurrency]);

  const handleSubmit = async (data: WalletFormData) => {
    if (!originalUser) return;

    setLoading(true);

    try {
      if (!exchangeRate) {
        throw new Error("Cotação não disponível. Tente novamente.");
      }

      const valorCompraLimpo = data.valorCompra.replace(/[^\d,.]/g, "");
      let valorCompraNumerico: number;

      if (moeda === "USD") {
        valorCompraNumerico = parseFloat(valorCompraLimpo.replace(/,/g, ""));
      } else {
        if (valorCompraLimpo.includes(",")) {
          valorCompraNumerico = parseFloat(
            valorCompraLimpo.replace(/\./g, "").replace(",", ".")
          );
        } else {
          valorCompraNumerico = parseFloat(valorCompraLimpo.replace(/\./g, ""));
        }
      }

      if (isNaN(valorCompraNumerico) || valorCompraNumerico <= 0) {
        throw new Error("Valor de compra inválido.");
      }

      const btcCalculado = calculateBTCFromValue(
        valorCompraNumerico,
        exchangeRate
      );

      const usuarioAtualizado: Usuario = {
        ...originalUser,
        nome: data.nome.trim(),
        sobrenome: data.sobrenome.trim(),
        email: data.email.trim().toLowerCase(),
        valor_carteira_btc: btcCalculado,
        moeda_fiat: data.moeda,
        valor_carteira_fiat: valorCompraNumerico.toFixed(2),
        cotacao_btc_fiat: exchangeRate.toString(),
        data_cotacao: lastUpdate || new Date().toISOString(),
      };

      const usuarioEditado = await UsuariosService.updateUsuario(
        usuarioAtualizado
      );

      form.reset();
      setBtcAmount("0.00000000");
      onOpenChange(false);

      success(
        "Carteira atualizada com sucesso!",
        `Carteira de ${usuarioEditado.nome} ${usuarioEditado.sobrenome} foi atualizada.`
      );

      if (onSuccess) {
        onSuccess(usuarioEditado);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar carteira";

      showError("Erro ao atualizar carteira", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setBtcAmount("0.00000000");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-1 md:gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <WalletIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Editar Carteira</DialogTitle>
            <DialogDescription className="text-left">
              Atualize as informações da carteira de {usuario.nome}{" "}
              {usuario.sobrenome}.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <div className="space-y-4">
              {/* Nome */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sobrenome */}
              <FormField
                control={form.control}
                name="sobrenome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="usuario@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Container responsivo para Valor de Compra e Bitcoin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                {/* Valor de compra com moeda */}
                <FormField
                  control={form.control}
                  name="valorCompra"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CurrencyInput
                          label="Valor de compra"
                          value={field.value}
                          currency={moeda}
                          onValueChange={field.onChange}
                          onCurrencyChange={(newCurrency) => {
                            setIsChangingCurrency(true);

                            form.setValue(
                              "moeda",
                              newCurrency as "BRL" | "USD" | "EUR"
                            );

                            setTimeout(() => {
                              setIsChangingCurrency(false);
                            }, 100);
                          }}
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="invisible">Quantidade estimada</Label>
                    {rateLoading && (
                      <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md h-9">
                    <Bitcoin className="h-4 w-4 text-orange-500" />
                    {rateLoading ? (
                      <span className="font-mono text-sm text-muted-foreground">
                        Carregando...
                      </span>
                    ) : rateError ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-red-500">
                          Erro na cotação
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            if (fetchImmediately) {
                              fetchImmediately(moeda);
                            } else {
                              preloadCurrency(moeda);
                            }
                          }}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Tentar
                        </Button>
                      </div>
                    ) : (
                      <span className="font-mono text-sm">{btcAmount} BTC</span>
                    )}
                  </div>
                  {exchangeRate && lastUpdate && !rateLoading && (
                    <p className="text-xs text-muted-foreground">
                      Cotação: {exchangeRate.toLocaleString()} {moeda}/BTC
                    </p>
                  )}
                  {!exchangeRate && !rateLoading && !rateError && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Cotação não disponível
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          if (fetchImmediately) {
                            fetchImmediately(moeda);
                          } else {
                            preloadCurrency(moeda);
                          }
                        }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Buscar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="premium"
                className="flex-1"
                disabled={loading || !exchangeRate || rateLoading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : rateLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Carregando cotação...
                  </>
                ) : !exchangeRate ? (
                  "Cotação indisponível"
                ) : (
                  "Atualizar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
