import { useId, forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { SelectNative } from "./select-native";
import { cn } from "../../lib/utils";

interface CurrencyInputProps {
  label: string;
  value: string;
  currency: string;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      value,
      currency,
      onValueChange,
      onCurrencyChange,
      placeholder,
      disabled,
      error,
      ...props
    },
    ref
  ) => {
    const id = useId();

    const formatCurrency = (val: string, currencyCode: string) => {
      let cleaned = val.replace(/[^\d,.]/g, "");

      if (!cleaned) return "";

      if (currencyCode === "BRL" || currencyCode === "EUR") {
        if (cleaned.includes(",")) {
          const parts = cleaned.split(",");
          const integerPart = parts[0].replace(/\./g, "");
          const decimalPart = parts[1] || "";

          const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            "."
          );

          return formattedInteger + (decimalPart ? "," + decimalPart : "");
        }

        const integerPart = cleaned.replace(/\./g, "");
        return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      if (currencyCode === "USD") {
        if (cleaned.includes(".")) {
          const parts = cleaned.split(".");
          const integerPart = parts[0].replace(/,/g, "");
          const decimalPart = parts[1] || "";

          const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          );

          return formattedInteger + (decimalPart ? "." + decimalPart : "");
        }

        const integerPart = cleaned.replace(/,/g, "");
        return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      return cleaned;
    };

    const removeMask = (val: string, currencyCode: string) => {
      if (!val) return "";

      let cleaned = val.replace(/[^\d,.]/g, "");

      if (!cleaned) return "";
      if (currencyCode === "USD") {
        return cleaned.replace(/,/g, "");
      } else {
        if (cleaned.includes(",")) {
          return cleaned.replace(/\./g, "").replace(",", ".");
        } else {
          return cleaned.replace(/\./g, "");
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCurrency(e.target.value, currency);
      onValueChange(formatted);
    };

    const getCurrencySymbol = (curr: string) => {
      switch (curr) {
        case "BRL":
          return "R$";
        case "USD":
          return "$";
        case "EUR":
          return "€";
        default:
          return curr;
      }
    };

    const getPlaceholder = (curr: string) => {
      switch (curr) {
        case "BRL":
          return "0,00";
        case "USD":
          return "0.00";
        case "EUR":
          return "0,00";
        default:
          return "0,00";
      }
    };

    return (
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex rounded-md shadow-xs">
          <div className="relative flex-1">
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
              {getCurrencySymbol(currency)}
            </span>
            <Input
              ref={ref}
              id={id}
              className={cn(
                "-me-px rounded-e-none ps-8 shadow-none focus-visible:z-10",
                error && "border-destructive"
              )}
              placeholder={placeholder || getPlaceholder(currency)}
              type="text"
              value={value}
              onChange={handleInputChange}
                    onBlur={(e) => {
      }}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "Escape",
                  "Enter",
                  "Home",
                  "End",
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                  ",",
                  ".",
                ];

                const isNumber = /^[0-9]$/.test(e.key);
                const isAllowedKey = allowedKeys.includes(e.key);
                const isCtrlA = e.ctrlKey && e.key === "a";
                const isCtrlC = e.ctrlKey && e.key === "c";
                const isCtrlV = e.ctrlKey && e.key === "v";
                const isCtrlX = e.ctrlKey && e.key === "x";
                const isCtrlZ = e.ctrlKey && e.key === "z";

                if (
                  !isNumber &&
                  !isAllowedKey &&
                  !isCtrlA &&
                  !isCtrlC &&
                  !isCtrlV &&
                  !isCtrlX &&
                  !isCtrlZ
                ) {
                  e.preventDefault();
                }
              }}
              disabled={disabled}
              {...props}
            />
          </div>
          <SelectNative
            className="text-muted-foreground hover:text-foreground w-fit rounded-s-none shadow-none"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            disabled={disabled}
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </SelectNative>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
