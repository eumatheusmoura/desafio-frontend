import { z } from "zod";

export const walletFormSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),

  sobrenome: z
    .string()
    .min(2, "Sobrenome deve ter pelo menos 2 caracteres")
    .max(50, "Sobrenome deve ter no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Sobrenome deve conter apenas letras"),

  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),

  valorCompra: z
    .string()
    .min(1, "Valor de compra é obrigatório")
    .refine((val) => {
      console.log("🔍 Validando valorCompra:", val);
      const num = parseValueToNumber(val);
      console.log("🔍 Valor convertido:", num);
      const isValid = !isNaN(num) && num > 0;
      console.log("🔍 É válido?", isValid);
      return isValid;
    }, "Valor deve ser um número positivo")
    .refine((val) => {
      const num = parseValueToNumber(val);
      const isValid = num <= 1000000;
      console.log("🔍 Valor máximo:", num, "É válido?", isValid);
      return isValid;
    }, "Valor máximo é 1.000.000"),

  moeda: z.enum(["BRL", "USD", "EUR"]),
});

export type WalletFormData = z.infer<typeof walletFormSchema>;

export const parseValueToNumber = (formattedValue: string): number => {
  if (!formattedValue) return 0;

  const cleaned = formattedValue.replace(/[R$€\s]/g, "");

  if (!cleaned) return 0;

  if (cleaned.includes(",") && cleaned.includes(".")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const result = parseFloat(normalized);
    return isNaN(result) ? 0 : result;
  } else if (cleaned.includes(",") && !cleaned.includes(".")) {
    const normalized = cleaned.replace(",", ".");
    const result = parseFloat(normalized);
    return isNaN(result) ? 0 : result;
  } else if (cleaned.includes(".") && !cleaned.includes(",")) {
    if (cleaned.match(/^\d+\.\d+$/)) {
      const result = parseFloat(cleaned);
      return isNaN(result) ? 0 : result;
    } else {
      const normalized = cleaned.replace(/,/g, "");
      const result = parseFloat(normalized);
      return isNaN(result) ? 0 : result;
    }
  } else {
    const result = parseInt(cleaned, 10);
    return isNaN(result) ? 0 : result;
  }
};

export const formatNumberToDisplay = (value: number): string => {
  return value.toString();
};
