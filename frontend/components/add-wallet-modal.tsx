"use client";

import React, { useState, useId } from "react";
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
  DialogTrigger,
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
import type { Usuario } from "../types/usuario";
import {
  walletFormSchema,
  type WalletFormData,
  parseValueToNumber,
} from "../lib/schemas/wallet-schema";

interface AddWalletModalProps {
  onSuccess?: (usuario: Usuario) => void;
  children: React.ReactNode;
}

const mockData = {
  endereco: "Rua das Flores, 123 - São Paulo, SP",
  data_nascimento: "1990-01-01T00:00:00Z",
  data_abertura: new Date().toISOString(),
  data_cotacao: new Date().toISOString(),
};

function generateBitcoinAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "1";
  for (let i = 0; i < 33; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function calculateBTCFromValue(
  valorFiat: number,
  exchangeRate: number
): string {
  if (exchangeRate <= 0) return "0.00000000";
  const btcAmount = valorFiat / exchangeRate;
  return btcAmount.toFixed(8);
}

export default function AddWalletModal({
  onSuccess,
  children,
}: AddWalletModalProps) {
  const id = useId();
  const { success, error: showError } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btcAmount, setBtcAmount] = useState("0.00000000");

  const [isChangingCurrency, setIsChangingCurrency] = useState(false);

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

  const valorCompra = form.watch("valorCompra");
  const moeda = form.watch("moeda");

  const { getRate, isLoading, getError, getLastUpdate, preloadCurrency } =
    useMultiExchangeRate();

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
  }, [moeda, preloadCurrency, rateLoading, exchangeRate]);

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
        setBtcAmount(calculateBTCFromValue(valorNumerico, exchangeRate));
      } else {
        setBtcAmount("0.00000000");
      }
    } else {
      setBtcAmount("0.00000000");
    }
  }, [valorCompra, moeda, exchangeRate, isChangingCurrency]);

  const handleSubmit = async (data: WalletFormData) => {
    setLoading(true);

    try {
      if (!exchangeRate) {
        throw new Error("Cotação não disponível. Tente novamente.");
      }

      const valorCompraLimpo = data.valorCompra.replace(/[^\d,.]/g, "");
      let valorCompraNumerico: number;

      if (data.moeda === "USD") {
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
      const enderecoCarteira = generateBitcoinAddress();

      const novoUsuario: Omit<Usuario, "id" | "criado_em"> = {
        nome: data.nome.trim(),
        sobrenome: data.sobrenome.trim(),
        email: data.email.trim().toLowerCase(),
        endereco: mockData.endereco,
        data_nascimento: mockData.data_nascimento,
        data_abertura: mockData.data_abertura,
        valor_carteira_btc: btcCalculado,
        endereco_carteira: enderecoCarteira,
        moeda_fiat: data.moeda,
        valor_carteira_fiat: valorCompraNumerico.toFixed(2),
        cotacao_btc_fiat: exchangeRate.toString(),
        data_cotacao: lastUpdate || mockData.data_cotacao,
      };

      const usuarioCriado = await UsuariosService.createUsuario(novoUsuario);

      form.reset();
      setBtcAmount("0.00000000");
      setOpen(false);

      success(
        "Carteira criada com sucesso!",
        `Nova carteira para ${usuarioCriado.nome} ${usuarioCriado.sobrenome}`
      );

      if (onSuccess) {
        onSuccess(usuarioCriado);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar carteira";

      showError("Erro ao criar carteira", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setBtcAmount("0.00000000");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-1 md:gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <WalletIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">
              Adicionar Nova Carteira
            </DialogTitle>
            <DialogDescription className="text-left">
              Crie uma nova carteira Bitcoin para o usuário.
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

                            preloadCurrency(newCurrency);
                            setIsChangingCurrency(false);
                          }}
                          placeholder="0,00"
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
                      <span className="font-mono text-sm text-red-500">
                        Erro na cotação
                      </span>
                    ) : (
                      <span className="font-mono text-sm">{btcAmount} BTC</span>
                    )}
                  </div>
                  {exchangeRate && lastUpdate && !rateLoading && (
                    <p className="text-xs text-muted-foreground opacity-50">
                      Cotação: {exchangeRate.toLocaleString()} {moeda}/BTC
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões */}
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
                    Criando...
                  </>
                ) : rateLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Carregando cotação...
                  </>
                ) : !exchangeRate ? (
                  "Cotação indisponível"
                ) : (
                  "Adicionar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
