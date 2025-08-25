"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Bitcoin, DollarSign, Euro, WalletIcon, Repeat } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Usuario, UsuarioDisplay } from "../types/usuario";
import { useMultiExchangeRate } from "../hooks/use-multi-exchange-rate";
import { useToast } from "../hooks/use-toast";
import { UsuariosService } from "../lib/services/usuarios";

interface ConvertBitcoinModalProps {
  usuario: UsuarioDisplay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (usuario: Usuario) => void;
}

export default function ConvertBitcoinModal({
  usuario,
  open,
  onOpenChange,
  onSuccess,
}: ConvertBitcoinModalProps) {
  const [bitcoinAmount, setBitcoinAmount] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState<"BRL" | "USD" | "EUR">(
    "BRL"
  );
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [isEditingOrigin, setIsEditingOrigin] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [conversionDirection, setConversionDirection] = useState<
    "btc-to-fiat" | "fiat-to-btc"
  >("btc-to-fiat");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { getRate, isLoading: rateLoading } = useMultiExchangeRate();
  const { success, error: showError } = useToast();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (
      open &&
      bitcoinAmount &&
      bitcoinAmount.trim() !== "" &&
      bitcoinAmount !== "0" &&
      bitcoinAmount !== "0,00" &&
      bitcoinAmount !== "0.00" &&
      !isEditingTarget
    ) {
      const amount = parseFormattedValue(bitcoinAmount, conversionDirection);
      const rate = getRate(targetCurrency);

      if (rate !== null && !isNaN(rate) && !isNaN(amount) && amount > 0) {
        let converted: number;
        if (conversionDirection === "btc-to-fiat") {
          converted = amount * rate;
        } else {
          converted = amount / rate;
        }

        const targetFormatted = converted.toFixed(
          conversionDirection === "btc-to-fiat" ? 2 : 8
        );

        setTargetAmount(targetFormatted);
      } else {
        setTargetAmount("");
      }
    } else if (
      open &&
      (!bitcoinAmount ||
        bitcoinAmount.trim() === "" ||
        bitcoinAmount === "0" ||
        bitcoinAmount === "0,00" ||
        bitcoinAmount === "0.00")
    ) {
      setTargetAmount("");
      setConvertedAmount("");
    }
  }, [
    open,
    bitcoinAmount,
    targetCurrency,
    conversionDirection,
    getRate,
    isEditingTarget,
  ]);

  useEffect(() => {
    if (open) {
      if (getRate && typeof getRate === "function") {
        setTimeout(() => {
          if (typeof window !== "undefined") {
          }
        }, 100);
      }
    }
  }, [open, targetCurrency, getRate]);

  useEffect(() => {
    if (open && !hasInitialized.current) {
      hasInitialized.current = true;
    }
  }, [open, conversionDirection]);

  useEffect(() => {
    if (!open) {
      hasInitialized.current = false;
    }
  }, [open]);

  const isButtonDisabled = useCallback(() => {
    if (!bitcoinAmount || bitcoinAmount.trim() === "" || isLoading) {
      return true;
    }

    const amount = parseFloat(bitcoinAmount);
    if (isNaN(amount) || amount <= 0) {
      return true;
    }

    if (conversionDirection === "btc-to-fiat") {
      const bitcoinBalance = parseFloat(usuario.bitcoin);

      if (
        isNaN(bitcoinBalance) ||
        bitcoinBalance === 0 ||
        amount > bitcoinBalance
      ) {
        return true;
      }
    } else {
      let fiatBalance: number;

      if (usuario.fiat === "N/A" || !usuario.fiat) {
        fiatBalance = 0;
      } else {
        const cleanFiat = usuario.fiat.replace(/[R$€\s]/g, "");
        fiatBalance = parseFloat(
          cleanFiat.replace(/\./g, "").replace(",", ".")
        );
      }

      if (isNaN(fiatBalance) || fiatBalance === 0 || amount > fiatBalance) {
        return true;
      }
    }

    return false;
  }, [
    bitcoinAmount,
    isLoading,
    conversionDirection,
    usuario.bitcoin,
    usuario.fiat,
  ]);

  const handleRotateIcon = useCallback(() => {
    setIsRotating(true);
    setConversionDirection((prev) => {
      const newDirection =
        prev === "btc-to-fiat" ? "fiat-to-btc" : "btc-to-fiat";
      if (newDirection === "fiat-to-btc") {
        setTimeout(() => setIsSelectOpen(true), 100);
      }
      return newDirection;
    });
    setRotationDegrees((prev) => prev + 180);
    setTimeout(() => setIsRotating(false), 500);
  }, []);

  useEffect(() => {
    if (isEditingOrigin) {
      return;
    }

    if (
      !bitcoinAmount ||
      bitcoinAmount.trim() === "" ||
      bitcoinAmount === "0" ||
      bitcoinAmount === "0,00" ||
      bitcoinAmount === "0.00" ||
      isNaN(parseFormattedValue(bitcoinAmount, conversionDirection)) ||
      parseFormattedValue(bitcoinAmount, conversionDirection) <= 0
    ) {
      setConvertedAmount("");
      setTargetAmount("");
      return;
    }

    if (!isEditingTarget) {
      const amount = parseFormattedValue(bitcoinAmount, conversionDirection);
      const rate = getRate(targetCurrency);

      if (rate !== null && !isNaN(rate)) {
        let converted: number;
        if (conversionDirection === "btc-to-fiat") {
          converted = amount * rate;
        } else {
          converted = amount / rate;
        }

        const targetFormatted = converted.toFixed(
          conversionDirection === "btc-to-fiat" ? 2 : 8
        );

        setConvertedAmount(converted.toFixed(8));
        setTargetAmount(targetFormatted);
      } else {
        setConvertedAmount("");
        setTargetAmount("");
      }
    } else {
      return;
    }
  }, [
    bitcoinAmount,
    targetCurrency,
    conversionDirection,
    getRate,
    isEditingTarget,
    isEditingOrigin,
  ]);
  const calculateOriginAmount = useCallback(
    (targetValue: string) => {
      if (!targetValue || isNaN(parseFloat(targetValue))) {
        return "";
      }

      const amount = parseFormattedValue(
        targetValue,
        conversionDirection === "btc-to-fiat" ? "fiat-to-btc" : "btc-to-fiat"
      );
      const rate = getRate(targetCurrency);

      if (rate !== null && !isNaN(rate)) {
        let originAmount: number;
        if (conversionDirection === "btc-to-fiat") {
          originAmount = amount / rate;
        } else {
          originAmount = amount * rate;
        }
        return originAmount.toFixed(
          conversionDirection === "btc-to-fiat" ? 8 : 2
        );
      }
      return "";
    },
    [targetCurrency, conversionDirection, getRate]
  );

  const handleSubmit = async () => {
    if (!bitcoinAmount || isNaN(parseFloat(bitcoinAmount))) {
      showError("Erro", "Por favor, insira um valor válido");
      return;
    }

    const amount = parseFloat(bitcoinAmount);

    if (conversionDirection === "btc-to-fiat") {
      if (amount > parseFloat(usuario.bitcoin)) {
        showError(
          "Saldo Insuficiente",
          "Você não possui saldo suficiente em Bitcoin para realizar esta conversão"
        );
        return;
      }
      if (parseFloat(usuario.bitcoin) === 0) {
        showError(
          "Sem Saldo",
          "Você não possui saldo em Bitcoin para converter"
        );
        return;
      }
    } else {
      if (amount > parseFloat(usuario.fiat)) {
        showError(
          "Saldo Insuficiente",
          "Você não possui saldo suficiente em Fiat para realizar esta conversão"
        );
        return;
      }
      if (parseFloat(usuario.fiat) === 0) {
        showError("Sem Saldo", "Você não possui saldo em Fiat para converter");
        return;
      }
    }

    setIsLoading(true);

    try {
      const usuarios = await UsuariosService.getUsuarios();
      const originalUser = usuarios.find((u) => u.id === usuario.id);

      if (!originalUser) {
        throw new Error("Usuário não encontrado");
      }

      const rate = getRate(targetCurrency);
      if (!rate) {
        throw new Error("Taxa de câmbio não disponível");
      }

      let newBitcoinBalance: number;
      let newFiatBalance: number;
      const targetAmountNumber = parseFloat(targetAmount);

      if (conversionDirection === "btc-to-fiat") {
        newBitcoinBalance =
          parseFloat(originalUser.valor_carteira_btc) - amount;
        newFiatBalance =
          parseFloat(originalUser.valor_carteira_fiat || "0") +
          targetAmountNumber;
      } else {
        newFiatBalance =
          parseFloat(originalUser.valor_carteira_fiat || "0") - amount;
        newBitcoinBalance =
          parseFloat(originalUser.valor_carteira_btc) + targetAmountNumber;
      }
      const usuarioAtualizado: Usuario = {
        ...originalUser,
        valor_carteira_btc: newBitcoinBalance.toFixed(8),
        valor_carteira_fiat: newFiatBalance.toFixed(2),
        moeda_fiat:
          conversionDirection === "btc-to-fiat"
            ? (targetCurrency as string)
            : originalUser.moeda_fiat,
        cotacao_btc_fiat: rate.toString(),
        data_cotacao: new Date().toISOString(),
      };

      const usuarioSalvo = await UsuariosService.updateUsuario(
        usuarioAtualizado
      );

      const fromCurrency =
        conversionDirection === "btc-to-fiat" ? "BTC" : targetCurrency;
      const toCurrency =
        conversionDirection === "btc-to-fiat" ? targetCurrency : "BTC";

      success(
        "Conversão realizada com sucesso!",
        `${bitcoinAmount} ${fromCurrency} convertidos para ${targetAmount} ${toCurrency}`
      );

      if (onSuccess) {
        onSuccess(usuarioSalvo);
      }

      onOpenChange(false);
      setBitcoinAmount("");
      setTargetAmount("");
      setConvertedAmount("");
      setIsEditingOrigin(false);
      setIsEditingTarget(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao realizar conversão";
      showError("Erro na conversão", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setBitcoinAmount("");
    setTargetAmount("");
    setConvertedAmount("");
    setIsEditingOrigin(false);
    setIsEditingTarget(false);
  };

  const formatCurrency = (amount: string, currency: string) => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (isNaN(num)) return "";

    return new Intl.NumberFormat(
      currency === "BRL" || currency === "EUR" ? "pt-BR" : "en-US",
      {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(num);
  };

  const formatInputValue = (
    value: string,
    direction: "btc-to-fiat" | "fiat-to-btc"
  ) => {
    if (!value) return "";

    let cleanValue = value.replace(/[^0-9.,]/g, "");

    if (direction === "fiat-to-btc") {
      if (cleanValue.includes(",")) {
        const parts = cleanValue.split(",");
        const integerPart = parts[0].replace(/\./g, "");
        const decimalPart = parts[1] || "";

        const formattedInteger = integerPart.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          "."
        );

        return formattedInteger + (decimalPart ? "," + decimalPart : "");
      }

      const integerPart = cleanValue.replace(/\./g, "");
      return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    if (direction === "btc-to-fiat") {
      cleanValue = cleanValue.replace(/,/g, ".");

      const dotCount = (cleanValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        const parts = cleanValue.split(".");
        cleanValue = parts[0] + "." + parts.slice(1).join("");
      }

      if (cleanValue.includes(".")) {
        const parts = cleanValue.split(".");
        const integerPart = parts[0];
        const decimalPart = parts[1];

        if (decimalPart && decimalPart.length > 8) {
          cleanValue = integerPart + "." + decimalPart.slice(0, 8);
        }
      }

      return cleanValue;
    }

    return cleanValue;
  };

  const parseFormattedValue = (
    formattedValue: string,
    direction: "btc-to-fiat" | "fiat-to-btc"
  ): number => {
    if (!formattedValue) return 0;

    let cleanValue = formattedValue.replace(/[^0-9.,]/g, "");

    if (direction === "fiat-to-btc") {
      if (cleanValue.includes(",")) {
        const parts = cleanValue.split(",");
        const integerPart = parts[0].replace(/\./g, "");
        const decimalPart = parts[1] || "";
        cleanValue = integerPart + "." + decimalPart;
      } else {
        cleanValue = cleanValue.replace(/\./g, "");
      }
    } else {
      cleanValue = cleanValue.replace(/,/g, ".");
    }

    return parseFloat(cleanValue) || 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Converter Saldo</DialogTitle>
        <div className="grid gap-2 py-4 relative">
          <div
            className={`p-4 rounded-lg relative z-10 ${
              conversionDirection === "btc-to-fiat"
                ? parseFloat(usuario.bitcoin) === 0
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  : "bg-stone-100 border dark:bg-stone-900/50"
                : parseFloat(usuario.fiat) === 0
                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                : "bg-stone-100 border dark:bg-stone-900/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 p-2 rounded-lg flex items-center justify-center ${
                    conversionDirection === "btc-to-fiat"
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : "bg-green-100 dark:bg-green-900/20"
                  }`}
                >
                  {conversionDirection === "btc-to-fiat" ? (
                    <Bitcoin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Converter de</p>
                  {conversionDirection === "btc-to-fiat" ? (
                    <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Bitcoin
                    </p>
                  ) : (
                    <Select
                      value={targetCurrency}
                      onValueChange={(value) => {
                        setTargetCurrency(value as "BRL" | "USD" | "EUR");
                      }}
                    >
                      <SelectTrigger className="w-auto border-0 shadow-none bg-transparent p-0 h-auto text-lg font-semibold text-stone-900 dark:text-stone-100 hover:bg-transparent focus:bg-transparent">
                        {targetCurrency}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">
                          <span className="text-lg leading-none">🇧🇷</span>{" "}
                          <span className="truncate">Real Brasileiro</span>
                        </SelectItem>
                        <SelectItem value="USD">
                          <span className="text-lg leading-none">🇺🇸</span>{" "}
                          <span className="truncate">Dólar Americano</span>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <span className="text-lg leading-none">🇪🇺</span>{" "}
                          <span className="truncate">Euro</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Valor</p>
                <input
                  type="text"
                  inputMode="decimal"
                  step={
                    conversionDirection === "btc-to-fiat"
                      ? "0.01"
                      : "0.00000001"
                  }
                  min="0"
                  placeholder={
                    conversionDirection === "btc-to-fiat"
                      ? "0,00"
                      : "0,00000000"
                  }
                  value={bitcoinAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    const formattedValue = formatInputValue(
                      value,
                      conversionDirection
                    );
                    setIsEditingOrigin(true);
                    setBitcoinAmount(formattedValue);

                    if (
                      !formattedValue ||
                      formattedValue.trim() === "" ||
                      formattedValue === "0" ||
                      formattedValue === "0,00" ||
                      formattedValue === "0.00"
                    ) {
                      setTargetAmount("");
                      setConvertedAmount("");
                    }
                  }}
                  onBlur={() => {
                    setIsEditingOrigin(false);
                  }}
                  className="w-32 h-8 !text-lg text-right !text-stone-900 dark:!text-stone-100 font-semibold border-0 !border-none outline-none bg-transparent p-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Escape",
                      "Enter",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ];

                    if (allowedKeys.includes(e.key)) {
                      return;
                    }

                    if (!/[0-9.,]/.test(e.key)) {
                      e.preventDefault();
                      return;
                    }

                    if (e.key === "," || e.key === ".") {
                      const currentValue = e.currentTarget.value;
                      if (
                        currentValue.includes(",") ||
                        currentValue.includes(".")
                      ) {
                        e.preventDefault();
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Ícone Repeat posicionado absolutamente entre os cards */}
          <div
            className="absolute left-1/2 top-25 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
            onClick={handleRotateIcon}
          >
            <div className="p-1.5  bg-white dark:bg-stone-800 rounded-full border-2 border-stone-200 dark:border-stone-600 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-700 transition-all duration-300">
              <Repeat
                className={`h-4 w-4 text-stone-600 dark:text-stone-400 transition-transform duration-500`}
                style={{
                  transform: `rotate(${rotationDegrees}deg)`,
                }}
              />
            </div>
          </div>

          <div className="p-4 bg-stone-100  dark:bg-stone-800/50 rounded-lg relative z-10 border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 p-2 rounded-lg flex items-center justify-center ${
                    conversionDirection === "btc-to-fiat"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-blue-100 dark:bg-blue-900/20"
                  }`}
                >
                  {conversionDirection === "btc-to-fiat" ? (
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Bitcoin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Receber em</p>
                  {conversionDirection === "btc-to-fiat" ? (
                    <Select
                      value={targetCurrency}
                      open={isSelectOpen}
                      onOpenChange={setIsSelectOpen}
                      onValueChange={(value) => {
                        setTargetCurrency(value as "BRL" | "USD" | "EUR");
                        setIsSelectOpen(false);
                      }}
                    >
                      <SelectTrigger className="w-auto border-0 shadow-none bg-transparent p-0 h-auto text-lg font-semibold text-stone-900 dark:text-stone-100 hover:bg-transparent focus:bg-transparent">
                        {targetCurrency}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">
                          <span className="text-lg leading-none">🇧🇷</span>{" "}
                          <span className="truncate">Real Brasileiro</span>
                        </SelectItem>
                        <SelectItem value="USD">
                          <span className="text-lg leading-none">🇺🇸</span>{" "}
                          <span className="truncate">Dólar Americano</span>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <span className="text-lg leading-none">🇪🇺</span>{" "}
                          <span className="truncate">Euro</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Bitcoin
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Valor</p>
                <input
                  type="text"
                  inputMode="decimal"
                  step={
                    conversionDirection === "btc-to-fiat"
                      ? "0.01"
                      : "0.00000001"
                  }
                  min="0"
                  placeholder={
                    conversionDirection === "btc-to-fiat"
                      ? "0,00"
                      : "0,00000000"
                  }
                  value={targetAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    const formattedValue = formatInputValue(
                      value,
                      conversionDirection === "btc-to-fiat"
                        ? "fiat-to-btc"
                        : "btc-to-fiat"
                    );
                    setIsEditingTarget(true);
                    setTargetAmount(formattedValue);
                  }}
                  onBlur={() => {
                    setIsEditingTarget(false);
                    if (targetAmount && !isEditingOrigin) {
                      const originAmount = calculateOriginAmount(targetAmount);
                      if (originAmount) {
                        setBitcoinAmount(originAmount);
                      }
                    }
                  }}
                  className="w-32 h-8 !text-lg text-right !text-stone-900 dark:!text-stone-100 font-semibold border-0 !border-none outline-none bg-transparent p-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Escape",
                      "Enter",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ];

                    if (allowedKeys.includes(e.key)) {
                      return;
                    }

                    if (!/[0-9.,]/.test(e.key)) {
                      e.preventDefault();
                      return;
                    }

                    if (e.key === "," || e.key === ".") {
                      const currentValue = e.currentTarget.value;
                      if (
                        currentValue.includes(",") ||
                        currentValue.includes(".")
                      ) {
                        e.preventDefault();
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {getRate(targetCurrency) && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Cotação: {getRate(targetCurrency)?.toFixed(2)} {targetCurrency}
                /BTC
              </p>
            </div>
          )}

          {/* Validação de saldo - Posicionada no final do modal */}
          {((conversionDirection === "btc-to-fiat" &&
            parseFloat(usuario.bitcoin) === 0) ||
            (conversionDirection === "fiat-to-btc" &&
              parseFloat(usuario.fiat) === 0)) && (
            <p className="text-xs text-red-600 dark:text-red-400 text-left mt-4">
              Você não possui saldo em{" "}
              {conversionDirection === "btc-to-fiat"
                ? "Bitcoin"
                : targetCurrency}{" "}
              para realizar esta conversão
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={Boolean(isLoading)}
          >
            Cancelar
          </Button>
          <Button
            variant="premium"
            onClick={handleSubmit}
            disabled={isButtonDisabled()}
          >
            {isLoading ? "Convertendo..." : "Converter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
